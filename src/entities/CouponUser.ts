import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Coupon } from "./Coupon";
import { User } from "./User";

@Entity()
export class CouponUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  couponId: number;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Coupon, (e) => e.couponusers)
  coupon: Coupon;

  @ManyToOne(() => User, (e) => e.couponusers)
  user: User;
}
