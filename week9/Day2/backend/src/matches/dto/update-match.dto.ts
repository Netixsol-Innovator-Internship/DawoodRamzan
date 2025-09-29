/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PartialType } from '@nestjs/mapped-types';
import { AskDto } from './ask.dto';

export class UpdateMatchDto extends PartialType(AskDto) {}
