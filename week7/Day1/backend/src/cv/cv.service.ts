/* eslint-disable */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CV } from './cv.schema';
import { User } from '../users/user.schema';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Document, Packer, Paragraph, TextRun } from 'docx';

@Injectable()
export class CVService {
  constructor(
    @InjectModel(CV.name) private cvModel: Model<any>,
    @InjectModel(User.name) private userModel: Model<any>,
  ) {
    (pdfMake as any).vfs = (pdfFonts as any).vfs;
  }

  async createCV(userId, cvData) {
    const cv = await this.cvModel.create({ ...cvData, userId });
    await this.userModel.findByIdAndUpdate(userId, {
      $push: { savedCVs: cv._id },
    });
    return cv;
  }

  async getCVs(userId) {
    return this.cvModel.find({ userId });
  }

  async getCVById(id, userId) {
    const cv = await this.cvModel.findOne({ _id: id, userId });
    if (!cv) throw new NotFoundException('CV not found');
    return cv;
  }

  async updateCV(id, userId, cvData) {
    const cv = await this.cvModel.findOneAndUpdate(
      { _id: id, userId },
      { $set: cvData }, // <-- use $set to replace arrays
      { new: true },
    );
    if (!cv) throw new NotFoundException('CV not found');
    console.log(cv);
    return cv;
  }

  async deleteCV(id, userId) {
    const cv = await this.cvModel.findOneAndDelete({ _id: id, userId });
    if (!cv) throw new NotFoundException('CV not found');
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { savedCVs: cv._id },
    });
    return { message: 'CV deleted successfully' };
  }

  async exportPDF(id, userId) {
    const cv = await this.getCVById(id, userId);
    return this.generatePDF(cv);
  }

  async exportDOCX(id, userId) {
    const cv = await this.getCVById(id, userId);
    return this.generateDOCX(cv);
  }

  // ---------------- PDF EXPORT ----------------
  private generatePDF(cv): Promise<Buffer> {
    const hr = {
      table: {
        widths: ['*'],
        body: [['']],
      },
      layout: {
        hLineWidth: () => 1,
        vLineWidth: () => 0,
        hLineColor: () => 'black',
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0,
      },
    };

    const documentDefinition = {
      content: [
        { text: cv.personalInfo.name, style: 'header' },
        {
          columns: [
            [
              cv.personalInfo.email ? { text: cv.personalInfo.email } : {},
              cv.personalInfo.phone ? { text: cv.personalInfo.phone } : {},
              cv.personalInfo.address ? { text: cv.personalInfo.address } : {},
            ],
            [
              cv.personalInfo.linkedin
                ? { text: cv.personalInfo.linkedin }
                : {},
              cv.personalInfo.website ? { text: cv.personalInfo.website } : {},
            ],
          ].filter(Boolean),
          style: 'subheader',
        },
        hr,

        // Education
        ...(cv.education?.length
          ? [
              { text: 'Education', style: 'sectionHeader' },
              ...cv.education.map((edu) => [
                { text: `${edu.degree} - ${edu.institution}`, bold: true },
                {
                  text: `${edu.startDate} - ${edu.endDate || 'Present'}`,
                  style: 'date',
                },
                edu.fieldOfStudy ? { text: edu.fieldOfStudy } : {},
                edu.description ? { text: edu.description } : {},
              ]),
              hr,
            ].flat()
          : []),

        // Experience
        ...(cv.experience?.length
          ? [
              { text: 'Experience', style: 'sectionHeader' },
              ...cv.experience.map((exp) => [
                { text: `${exp.position} - ${exp.company}`, bold: true },
                {
                  text: `${exp.startDate} - ${exp.endDate || 'Present'}`,
                  style: 'date',
                },
                exp.description ? { text: exp.description } : {},
                exp.achievements?.length ? { ul: exp.achievements } : {},
              ]),
              hr,
            ].flat()
          : []),

        // Skills
        ...(cv.skills?.length
          ? [
              { text: 'Skills', style: 'sectionHeader' },
              {
                ul: cv.skills.map((s) =>
                  s.level ? `${s.name} (${s.level}/10)` : s.name,
                ),
              },
              hr,
            ]
          : []),

        // Projects
        ...(cv.projects?.length
          ? [
              { text: 'Projects', style: 'sectionHeader' },
              ...cv.projects.map((proj) => [
                { text: proj.name, bold: true },
                proj.description ? { text: proj.description } : {},
                proj.technologies
                  ? { text: `Technologies: ${proj.technologies}` }
                  : {},
                proj.link
                  ? { text: proj.link, color: 'blue', link: proj.link }
                  : {},
              ]),
              hr,
            ].flat()
          : []),

        // Languages
        ...(cv.languages?.length
          ? [
              { text: 'Languages', style: 'sectionHeader' },
              {
                ul: cv.languages.map(
                  (lang) =>
                    `${lang.language}${lang.proficiency ? ` (${lang.proficiency})` : ''}`,
                ),
              },
              hr,
            ]
          : []),

        // Certifications
        ...(cv.certifications?.length
          ? [
              { text: 'Certifications', style: 'sectionHeader' },
              {
                ul: cv.certifications.map(
                  (cert) =>
                    `${cert.name} - ${cert.issuer}${cert.date ? ` (${cert.date})` : ''}`,
                ),
              },
            ]
          : []),
      ],
      styles: {
        header: { fontSize: 22, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 12, margin: [0, 0, 0, 5] },
        sectionHeader: { fontSize: 16, bold: true, margin: [0, 10, 0, 5] },
        date: { fontSize: 10, italics: true, color: 'gray' },
      },
    };

    const pdfDoc = (pdfMake as any).createPdf(documentDefinition);
    return new Promise((resolve) => {
      pdfDoc.getBuffer((buffer) => resolve(Buffer.from(buffer)));
    });
  }

  // ---------------- DOCX EXPORT ----------------
  private async generateDOCX(cv): Promise<Buffer> {
    const children: any[] = [];

    // Header
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: cv.personalInfo.name, bold: true, size: 32 }),
        ],
      }),
    );
    children.push(
      new Paragraph(
        [
          cv.personalInfo.email,
          cv.personalInfo.phone,
          cv.personalInfo.address,
          cv.personalInfo.linkedin,
          cv.personalInfo.website,
        ]
          .filter(Boolean)
          .join(' | '),
      ),
    );
    children.push(
      new Paragraph({
        children: [
          new TextRun('______________________________________________________'),
        ],
      }),
    );

    // Education
    if (cv.education?.length) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: 'Education', bold: true, size: 28 })],
        }),
      );
      cv.education.forEach((edu) => {
        children.push(
          new Paragraph({ text: `${edu.degree} - ${edu.institution}` }),
        );
        children.push(
          new Paragraph({
            text: `${edu.startDate} - ${edu.endDate || 'Present'}`,
          }),
        );
        if (edu.fieldOfStudy)
          children.push(new Paragraph({ text: edu.fieldOfStudy }));
        if (edu.description)
          children.push(new Paragraph({ text: edu.description }));
      });
      children.push(
        new Paragraph('______________________________________________________'),
      );
    }

    // Experience
    if (cv.experience?.length) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: 'Experience', bold: true, size: 28 })],
        }),
      );
      cv.experience.forEach((exp) => {
        children.push(
          new Paragraph({ text: `${exp.position} - ${exp.company}` }),
        );
        children.push(
          new Paragraph({
            text: `${exp.startDate} - ${exp.endDate || 'Present'}`,
          }),
        );
        if (exp.description)
          children.push(new Paragraph({ text: exp.description }));
        if (exp.achievements?.length) {
          exp.achievements.forEach((ach) => {
            children.push(
              new Paragraph({ children: [new TextRun({ text: `• ${ach}` })] }),
            );
          });
        }
      });
      children.push(
        new Paragraph('______________________________________________________'),
      );
    }

    // Skills
    if (cv.skills?.length) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: 'Skills', bold: true, size: 28 })],
        }),
      );
      children.push(
        new Paragraph(
          cv.skills
            .map((s) => (s.level ? `${s.name} (${s.level}/10)` : s.name))
            .join(', '),
        ),
      );
      children.push(
        new Paragraph('______________________________________________________'),
      );
    }

    // Projects
    if (cv.projects?.length) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: 'Projects', bold: true, size: 28 })],
        }),
      );
      cv.projects.forEach((proj) => {
        children.push(new Paragraph({ text: proj.name }));
        if (proj.description)
          children.push(new Paragraph({ text: proj.description }));
        if (proj.technologies)
          children.push(
            new Paragraph({ text: `Technologies: ${proj.technologies}` }),
          );
        if (proj.link)
          children.push(new Paragraph({ text: `Link: ${proj.link}` }));
      });
      children.push(
        new Paragraph('______________________________________________________'),
      );
    }

    // Languages
    if (cv.languages?.length) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: 'Languages', bold: true, size: 28 })],
        }),
      );
      children.push(
        new Paragraph(
          cv.languages
            .map(
              (l) =>
                `${l.language}${l.proficiency ? ` (${l.proficiency})` : ''}`,
            )
            .join(', '),
        ),
      );
      children.push(
        new Paragraph('______________________________________________________'),
      );
    }

    // Certifications
    if (cv.certifications?.length) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Certifications', bold: true, size: 28 }),
          ],
        }),
      );
      children.push(
        new Paragraph(
          cv.certifications
            .map(
              (c) => `${c.name} - ${c.issuer}${c.date ? ` (${c.date})` : ''}`,
            )
            .join(', '),
        ),
      );
    }

    const doc = new Document({ sections: [{ children }] });
    const buffer = await Packer.toBuffer(doc);
    return Buffer.from(buffer);
  }
}
