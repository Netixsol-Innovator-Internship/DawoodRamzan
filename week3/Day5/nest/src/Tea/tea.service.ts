/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tea, TeaDocument } from 'src/Schema/tea.schema';

@Injectable()
export class TeaService {
  constructor(
    @InjectModel(Tea.name) private readonly teaModel: Model<TeaDocument>,
  ) {}

  async createTea(data: Partial<Tea>): Promise<Tea> {
    const tea = new this.teaModel(data);
    return tea.save();
  }

  async getTeas(): Promise<Tea[]> {
    return this.teaModel.find().exec();
  }

  async getTeaById(id: string): Promise<Tea> {
    const tea = await this.teaModel.findById(id).exec();
    if (!tea) throw new NotFoundException('Tea not found');
    return tea;
  }

  async updateTea(id: string, data: Partial<Tea>): Promise<Tea> {
    const tea = await this.teaModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!tea) throw new NotFoundException('Tea not found');
    return tea;
  }

  async deleteTea(id: string): Promise<{ message: string }> {
    const tea = await this.teaModel.findByIdAndDelete(id).exec();
    if (!tea) throw new NotFoundException('Tea not found');
    return { message: 'Tea deleted successfully' };
  }

  async filterTeas(query: {
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
  }): Promise<Tea[]> {
    const filter: any = {};

    if (query.type) filter.collection = query.type;
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = query.minPrice;
      if (query.maxPrice) filter.price.$lte = query.maxPrice;
    }
    if (query.minRating) filter.rating = { $gte: query.minRating };

    return this.teaModel.find(filter).exec();
  }
}
