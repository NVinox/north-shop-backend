import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column({ type: 'int' })
  price!: number;

  @Column({ name: 'old_price', type: 'int', nullable: true })
  oldPrice!: number;

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
  })
  ratingAvg!: number;

  @Column({ name: 'review_count', type: 'int', default: 0 })
  reviewCount!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
