import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Collection } from "./Collection";
import { Product } from "./Product";

@Entity()
export class ProductCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ default: "" })
  thumbnail: string;

  @Column({ default: "" })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column()
  collectionId: number;

  @ManyToOne(() => Collection, (e) => e.productCategories)
  collection: Collection;

  @OneToMany(() => Product, (e) => e.productCategory)
  products: Product[];
}
