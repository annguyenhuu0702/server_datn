import { queryItems } from "../common/type";

export interface createProductCategory {
  collectionId: number;
  name: string;
  description: string;
  thumbnail: string;
}

export interface updateProductCategory extends createProductCategory {}

export interface getAllProductCategory extends queryItems {
  name?: string;
  slug?: string;
  collection?: boolean;
}
