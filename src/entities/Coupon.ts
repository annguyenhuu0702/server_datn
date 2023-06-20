import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { CouponUser } from "./CouponUser";

@Entity()
export class Coupon extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: "",
  })
  name: string;

  @Column({
    default: "",
  })
  slug: string;

  @Column({ default: "" })
  type: string;

  @Column({ default: "" })
  description: string;

  @Column({ default: new Date() })
  startday: Date;

  @Column({ default: new Date() })
  endday: Date;

  @Column({
    default: 1,
  })
  percent: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => CouponUser, (e) => e.coupon)
  couponusers: CouponUser[];

  @OneToMany(() => User, (e) => e.coupons)
  user: User;
}
