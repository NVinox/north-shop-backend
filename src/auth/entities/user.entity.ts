import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { EUserRole } from '../enums/user-role.enum';
import { RefreshTokenEntity } from 'src/refresh-token/entities/refresh-token.entity';

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
