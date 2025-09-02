import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// {
//   "name": "SUV",
//   "description": "Sport Utility Vehicles with high ground clearance and spacious interiors.",
//   "image": "https://example.com/suv-category.jpg"
// }
