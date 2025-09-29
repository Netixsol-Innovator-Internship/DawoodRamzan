/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MatchDocument = Match & Document;

@Schema({ timestamps: false })
export class Match {
  @Prop() format?: string;
  @Prop() Team: string;
  @Prop() Opposition: string;
  @Prop() Ground: string;
  @Prop() Runs: string;
  @Prop() Wickets: number;
  @Prop() Overs: number;
  @Prop() RPO: number;
  @Prop() Inns: number;
  @Prop() lead?: string;
  @Prop() Result: string;
  @Prop() Balls: number;
  @Prop() BallsPerOver: number;
  @Prop({ type: String, alias: 'Start Date' }) startDate: string; // stored as "17-Feb-05"
}
export const MatchSchema = SchemaFactory.createForClass(Match);
