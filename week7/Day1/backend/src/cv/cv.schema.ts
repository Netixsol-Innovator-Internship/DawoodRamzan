import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../users/user.schema';

@Schema({ timestamps: true })
export class CV extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: Object })
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    website: string;
  };

  @Prop({ type: [Object] })
  education: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];

  @Prop({ type: [Object] })
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements: string[];
  }[];

  @Prop({ type: [Object] })
  skills: {
    name: string;
    level: number;
  }[];

  @Prop({ type: [Object] })
  projects: {
    name: string;
    description: string;
    technologies: string[];
    link: string;
  }[];

  @Prop({ type: [Object], default: [] })
  languages: {
    language: string;
    proficiency: string;
  }[];

  @Prop({ type: [Object], default: [] })
  certifications: {
    name: string;
    issuer: string;
    date: string;
  }[];
}

export const CVSchema = SchemaFactory.createForClass(CV);
