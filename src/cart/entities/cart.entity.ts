import {
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { UserEntity } from '../../auth/entities/user.entity';
import { CartEntityItem } from '../../cart-item/entities/cart-item.entity';

@Entity({ name: 'cart' })
export class CartEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @OneToOne(() => UserEntity, ({ cart }) => cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @OneToMany(() => CartEntityItem, ({ cart }) => cart, {
    cascade: true,
  })
  items!: CartEntityItem[];
}
