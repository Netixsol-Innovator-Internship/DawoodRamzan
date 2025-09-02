import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tea, TeaSchema } from 'src/Schema/tea.schema';
import { TeaService } from './tea.service';
import { TeaController } from './tea.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tea.name, schema: TeaSchema }])],
  controllers: [TeaController],
  providers: [TeaService],
  exports: [TeaService],
})
export class TeaModule {}
