/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { CVService } from './cv.service';

@Controller('cv')
@UseGuards(AuthGuard('jwt'))
export class CVController {
  constructor(private readonly cvService: CVService) {}

  @Post()
  create(@Req() req, @Body() createCVDto: any) {
    return this.cvService.createCV(req.user.userId, createCVDto);
  }

  @Get()
  findAll(@Req() req) {
    return this.cvService.getCVs(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.cvService.getCVById(id, req.user.userId);
  }

  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() updateCVDto: any) {
    return this.cvService.updateCV(id, req.user.userId, updateCVDto);
    console.log('------------');
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.cvService.deleteCV(id, req.user.userId);
  }

  @Get(':id/export/pdf')
  async exportPDF(@Req() req, @Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.cvService.exportPDF(id, req.user.userId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="CV_${id}.pdf"`,
      //   'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

  @Get(':id/export/docx')
  async exportDOCX(@Req() req, @Param('id') id: string, @Res() res: Response) {
    const docxBuffer = await this.cvService.exportDOCX(id, req.user.userId);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="CV_${id}.docx"`,
      'Content-Length': docxBuffer.length,
    });
    res.end(docxBuffer);
  }
}
