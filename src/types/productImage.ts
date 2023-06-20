import { queryItems } from "../common/type";
import { ProductImage } from "../entities/ProductImage";

export interface createProductImage {
  productId: number;
  pathImgs: Array<{
    variantValueId: number;
    path: string;
  }>;
  listId: number[];
  thumbnail: string;
  updateImages: ProductImage[];
}

export interface updateProductImage extends createProductImage {}

export interface getAllProductImage extends queryItems {
  productId: string;
}
