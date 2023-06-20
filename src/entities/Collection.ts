import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Category } from "./Category";
import { ProductCategory } from "./ProductCategory";

@Entity()
export class Collection extends BaseEntity {
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
  categoryId: number;

  @ManyToOne(() => Category, (e) => e.collections)
  category: Category;

  @OneToMany(() => ProductCategory, (e) => e.collection)
  productCategories: ProductCategory[];
}
