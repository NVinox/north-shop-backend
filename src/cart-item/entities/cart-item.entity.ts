import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { CartEntity } from '../../cart/entities/cart.entity';
import { ProductEntity } from '../../product/entities/product.entity';

@Entity({ name: 'cart-item' })
@Unique(['cartId', 'productId'])
export class CartEntityItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'cart_id' })
  cartId!: number;

  @Column({ name: 'product_id' })
  productId!: number;

  @Column({ type: 'integer' })
  quantity!: number;

  @Column({ type: 'integer', name: 'price_at_addition' })
  priceAtAddition!: number;

  @ManyToOne(() => CartEntity, ({ items }) => items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cart_id' })
  cart!: CartEntity;

  @ManyToOne(() => ProductEntity, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
