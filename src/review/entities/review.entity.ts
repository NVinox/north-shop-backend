import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProductEntity } from 'src/product/entities/product.entity';
import { UserEntity } from 'src/auth/entities/user.entity';

@Entity({ name: 'reviews' })
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  text!: string;

  @Column({ type: 'smallint' })
  rating!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ name: 'product_id' })
  productId!: number;

  @ManyToOne(() => ProductEntity, ({ reviews }) => reviews, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;

  @ManyToOne(() => UserEntity, ({ reviews }) => reviews, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
