/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const createdProduct = new this.productModel(createProductDto);
    try {
      this.notificationsGateway.broadcastAdd(createdProduct?.name);
      console.log('Emitted');
    } catch (e) {
      console.error('Failed to emit purchase event', e);

      // non-blocking
    }
    return createdProduct.save();
  }

  async findAll(
    category?: string,
    dressStyle?: string,
    minPrice?: number,
    maxPrice?: number,
    size?: string,
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ products: ProductDocument[]; total: number }> {
    const filter: any = {};

    if (category) filter.category = category;
    if (dressStyle) filter.dressStyle = dressStyle;
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }
    if (size) filter.sizes = size;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const products = await this.productModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.productModel.countDocuments(filter).exec();

    return { products, total };
  }

  async findOne(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    return updatedProduct;
  }

  async remove(id: string): Promise<ProductDocument> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
      throw new NotFoundException('Product not found');
    }
    return deletedProduct;
  }

  async updateStock(id: string, quantity: number): Promise<ProductDocument> {
    const product = await this.productModel
      .findByIdAndUpdate(
        id,
        { $inc: { stockQuantity: -quantity } },
        { new: true },
      )
      .exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
