import { DataSource, Repository } from 'typeorm';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

import { ProductImageEntity } from './entities/product-image.entity';
import { UpdateProductImageDTO } from './dto/update-product-image.dto';
import { CreateProductImageDTO } from './dto/create-product-image.dto';
import { CreateImageByProductDTO } from './dto/create-image-by-product.dto';

import { ProductService } from 'src/product/product.service';
import { MAX_PRODUCT_IMAGES_LENGTH } from 'src/utils/constants.utils';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly productImageRepository: Repository<ProductImageEntity>,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
    private readonly dataSource: DataSource,
  ) {}

  async getAllImagesByProduct(
    productId: number,
  ): Promise<ProductImageEntity[]> {
    const product = await this.productService.getOne(productId);

    if (!product) {
      throw new NotFoundException(`product with id ${productId} not found`);
    }

    return product.images;
  }

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
    const product = await this.productService.existProduct(dto.productId);

    if (!product) {
      throw new NotFoundException(`product with id ${dto.productId} not found`);
    }

    const productImages = await this.getAllImagesByProduct(dto.productId);

    if (productImages.length) {
      if (productImages.length === MAX_PRODUCT_IMAGES_LENGTH) {
        throw new PayloadTooLargeException(
          `The image limit has been exceeded: you cannot upload more than ${MAX_PRODUCT_IMAGES_LENGTH} images for a single product`,
        );
      }

      if (dto.isMain) {
        const mainProductImage = await this.productImageRepository.findOne({
          where: { productId: dto.productId, isMain: true },
        });

        if (mainProductImage) {
          mainProductImage.isMain = false;
          await this.productImageRepository.save(mainProductImage);
        }
      }
    } else {
      dto.isMain = true;
    }

    const fileUrl = this.upload(file);
    const imageMemory = this.productImageRepository.create({
      ...dto,
      url: fileUrl,
    });
    const image = await this.productImageRepository.save(imageMemory);

    return await this.getOne(image.id);
  }

  async createImageByProduct(
    dto: CreateImageByProductDTO,
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

  async update(
    id: number,
    dto: UpdateProductImageDTO,
  ): Promise<ProductImageEntity> {
    return await this.dataSource.transaction(async (manager) => {
      const productImage = await manager.findOne(ProductImageEntity, {
        where: { id },
      });

      if (!productImage) {
        throw new NotFoundException(`image with id ${id} not found`);
      }

      if (dto.isMain) {
        const mainProductImage = await manager.findOne(ProductImageEntity, {
          where: {
            isMain: true,
          },
        });

        if (mainProductImage) {
          mainProductImage.isMain = false;
          await manager.save(mainProductImage);
        }

        productImage.isMain = true;
        await manager.save(productImage);
      } else {
        if (productImage.isMain) {
          const productImages = await manager.find(ProductImageEntity, {
            where: {
              productId: productImage.productId,
            },
            order: { id: 'DESC' },
          });
          const firstProductImage = productImages[0];

          firstProductImage.isMain = true;
          productImage.isMain = false;

          await manager.save(productImage);
          await manager.save(firstProductImage);
        }
      }

      return productImage;
    });
  }

  async delete(id: number): Promise<Boolean> {
    return await this.dataSource.transaction(async (manager) => {
      const productImage = await manager.findOne(ProductImageEntity, {
        where: { id },
      });

      if (!productImage) {
        throw new NotFoundException(`image with id ${id} not found`);
      }

      await manager.remove(productImage);

      if (productImage.isMain) {
        const remainingImages = await manager.find(ProductImageEntity, {
          where: { productId: productImage.productId },
          order: { id: 'DESC' },
        });

        if (remainingImages.length) {
          const nextImage = remainingImages[0];

          nextImage.isMain = true;

          await manager.save(nextImage);
        }
      }

      await this.removeImage(productImage.url);

      return true;
    });
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
