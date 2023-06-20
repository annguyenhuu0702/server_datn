import { queryItems } from "../common/type";

export interface createProduct {
  productCategoryId: number;
  name: string;
  slug: string;
  thumbnail: string;
  description: string;
  material: string;
  guide: string;
  price: number;
  // priceSale: number;
}

export interface updateProduct extends createProduct {}

export interface getAllProduct extends queryItems {
  name?: string;
  slug?: string;
  otherSlug?: string;
  min?: string;
  max?: string;
  sizesId?: string;
  colorsId?: string;
}

export interface getByCategory {
  limitCollection?: string;
  limitProduct?: string;
}

export interface searchProduct extends queryItems {
  keyword?: string;
}
