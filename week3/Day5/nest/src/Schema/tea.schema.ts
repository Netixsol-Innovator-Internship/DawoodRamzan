// tea.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeaDocument = Tea & Document;

@Schema({ timestamps: true })
export class Tea {
  @Prop({
    type: [String],
    enum: [
      'Black tea',
      'Green tea',
      'White tea',
      'Chai',
      'Matcha',
      'Herbal teas',
      'Oolong',
      'Rooibos',
      'Tisane',
    ],
    required: true,
  })
  collection: string[];

  @Prop({
    type: [String],
    enum: ['India', 'Japan', 'Sri Lanka', 'South Africa'],
    required: true,
  })
  origin: string[];

  @Prop({
    type: [String],
    enum: [
      'Spicy',
      'Sweet',
      'Citrus',
      'Smooth',
      'Fruity',
      'Floral',
      'Grassy',
      'Minty',
      'Bitter',
      'Creamy',
    ],
    default: [],
  })
  flavour: string[];

  @Prop({
    type: [String],
    enum: ['Detox', 'Energy', 'Relax', 'Digestion'],
    default: [],
  })
  quality: string[];

  @Prop({
    type: String,
    enum: ['No Caffeine', 'Low Caffeine', 'Medium Caffeine', 'High Caffeine'],
    required: true,
  })
  caffeine: string;

  @Prop({
    type: [String],
    enum: ['Lactose-free', 'Gluten-free', 'Nut-free', 'Soy-free'],
    default: [],
  })
  allergens: string[];

  @Prop({
    type: String,
    enum: ['Yes', 'No'],
    required: true,
  })
  organic: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  image?: string;
}

export const TeaSchema = SchemaFactory.createForClass(Tea);
