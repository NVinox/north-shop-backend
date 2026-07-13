import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { RefreshTokenEntity } from 'src/refresh-token/entities/refresh-token.entity';
import { ReviewEntity } from 'src/review/entities/review.entity';
import { CartEntity } from 'src/cart/entities/cart.entity';

import { EUserRole } from '../enums/user-role.enum';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'enum', enum: EUserRole, default: EUserRole.USER })
  role!: EUserRole;

  @OneToMany(() => RefreshTokenEntity, ({ user }) => user, {
    cascade: true,
  })
  refreshTokens!: RefreshTokenEntity[];

  @OneToMany(() => ReviewEntity, ({ user }) => user, { cascade: true })
  reviews!: ReviewEntity[];

  @OneToOne(() => CartEntity, (cart) => cart.user)
  cart!: CartEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
