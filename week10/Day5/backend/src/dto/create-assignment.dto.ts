/* eslint-disable */
// src/dto/create-assignment.dto.ts
import { IsString, IsNumber, IsIn, IsOptional } from 'class-validator';

export class CreateAssignmentDto {
  @IsString()
  title: string;

  @IsString()
  instructions: string;

  @IsNumber()
  wordCount: number;

  @IsOptional()
  @IsIn(['strict', 'loose'])
  evaluationMode: 'strict' | 'loose';
}
