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
import { Payment } from "./Payment";
import { ProductVariant } from "./ProductVariant";

@Entity()
export class PaymentItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paymentId: number;

  @Column()
  productVariantId: number;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Payment, (e) => e.paymentItems)
  payment: Payment;

  @ManyToOne(() => ProductVariant, (e) => e.cartItem)
  productVariant: ProductVariant;
}
