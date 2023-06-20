import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CartItem } from "./CartItem";
import { Product } from "./Product";
import { VariantValue } from "./VariantValue";

@Entity()
export class ProductVariant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  name: string;

  @Column()
  inventory: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Product, (e) => e.productVariants)
  product: Product;

  @OneToMany(() => CartItem, (e) => e.productVariant)
  cartItem: CartItem;

  @ManyToMany(() => VariantValue, (e) => e.productVariants)
  @JoinTable({ name: "productVariant_variantValues" })
  variantValues: VariantValue[];
}
