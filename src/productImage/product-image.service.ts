import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

import { ProductImageEntity } from './entities/productImage.entity';
import { CreateProductImageDTO } from './dto/create-product-image.dto';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly productImageRepository: Repository<ProductImageEntity>,
  ) {}

  async getOne(id: number): Promise<ProductImageEntity> {
    const image = await this.productImageRepository.findOneBy({ id });

    if (!image) {
      throw new NotFoundException();
    }

    return image;
  }

  async create(
    dto: CreateProductImageDTO,
    file: Express.Multer.File,
  ): Promise<ProductImageEntity> {
    const fileUrl = this.upload(file);
    const imageMemory = this.productImageRepository.create({
      ...dto,
      url: fileUrl,
    });
    const image = await this.productImageRepository.save(imageMemory);

    return await this.getOne(image.id);
  }

  async removeImage(url: string) {
    const filePath = path.join(process.cwd(), 'uploads', url);

    if (fs.existsSync(filePath)) {
      await fsPromises.unlink(filePath);
    }
  }

  private upload(file: Express.Multer.File): string {
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    const uploadDir = path.join(process.cwd(), 'uploads');
    const filePath = path.join(uploadDir, fileName);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(filePath, file.buffer);

    return fileName;
  }
}
