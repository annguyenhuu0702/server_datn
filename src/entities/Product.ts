import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { FavoriteProduct } from "./LoveProduct";
import { ProductCategory } from "./ProductCategory";
import { ProductImage } from "./ProductImage";
import { ProductVariant } from "./ProductVariant";
import { Comment } from "./Comment";

@Unique(["code"])
@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productCategoryId: number;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  code: string;

  @Column()
  slug: string;

  @Column({ default: 0 })
  totalStar: number;

  @Column({ default: "" })
  thumbnail: string;

  @Column({ default: "" })
  description: string;

  @Column({ default: "" })
  material: string;

  @Column({ default: "" })
  guide: string;

  @Column({ default: false })
  isActive: boolean;

  @Column()
  price: number;

  @Column({ nullable: true })
  priceSale: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => ProductVariant, (e) => e.product)
  productVariants: ProductVariant[];

  @OneToMany(() => ProductImage, (e) => e.product)
  productImages: ProductImage[];

  @ManyToOne(() => ProductCategory, (e) => e.products)
  productCategory: ProductCategory;

  @OneToMany(() => FavoriteProduct, (e) => e.product)
  favoriteProducts: FavoriteProduct[];

  @OneToMany(() => Comment, (e) => e.product)
  comments: Comment[];
}
