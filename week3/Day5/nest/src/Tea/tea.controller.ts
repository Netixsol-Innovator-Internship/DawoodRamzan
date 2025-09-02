import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { TeaService } from './tea.service';
import { Tea } from 'src/Schema/tea.schema';

@Controller('teas')
export class TeaController {
  constructor(private readonly teaService: TeaService) {}

  @Post()
  async createTea(@Body() data: Partial<Tea>) {
    return this.teaService.createTea(data);
  }

  @Get()
  async getTeas() {
    return this.teaService.getTeas();
  }

  @Get('filter')
  async filterTeas(
    @Query('type') type?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('minRating') minRating?: number,
  ) {
    return this.teaService.filterTeas({
      type,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
    });
  }

  @Get(':id')
  async getTeaById(@Param('id') id: string) {
    return this.teaService.getTeaById(id);
  }

  @Put(':id')
  async updateTea(@Param('id') id: string, @Body() data: Partial<Tea>) {
    return this.teaService.updateTea(id, data);
  }

  @Delete(':id')
  async deleteTea(@Param('id') id: string) {
    return this.teaService.deleteTea(id);
  }
}
