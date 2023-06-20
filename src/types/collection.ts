import { queryItems } from "../common/type";

export interface createCollection {
  categoryId: number;
  name: string;
  description: string;
  thumbnail: string;
}

export interface updateCollection extends createCollection {}

export interface getAllCollection extends queryItems {
  productCategories?: boolean;
  collection?: boolean;
  name?: string;
  slug?: string;
}
