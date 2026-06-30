import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PriceTransformer } from 'src/common/transformers/price.transformer';
import { ReviewAvgTransformer } from 'src/common/transformers/review-avg.transformer';
import { ProductImageEntity } from 'src/productImage/entities/product-image.entity';
import { ReviewEntity } from 'src/review/entities/review.entity';

@Entity({ name: 'products' })
@Check(`"price" >= 0`)
@Check(`"old_price" >= 0`)
@Check(`"review_count" >= 0`)
@Check(`"discount" >= 0 AND "discount" <= 100`)
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'int', transformer: new PriceTransformer() })
  price!: number;

  @Column({
    name: 'old_price',
    type: 'int',
    nullable: true,
    transformer: new PriceTransformer(),
  })
  oldPrice!: number | null;

  @Column({ type: 'int', default: 0 })
  discount!: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  sku!: string;

  @Column({
    name: 'rating_avg',
    type: 'decimal',
    precision: 3,
    scale: 1,
    default: 0,
    transformer: new ReviewAvgTransformer(),
  })
  ratingAvg!: number;

  @Column({ name: 'review_count', type: 'int', default: 0 })
  reviewCount!: number;

  @OneToMany(() => ProductImageEntity, ({ product }) => product, {
    cascade: true,
  })
  images!: ProductImageEntity[];

  @OneToMany(() => ReviewEntity, ({ product }) => product)
  reviews!: ReviewEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
