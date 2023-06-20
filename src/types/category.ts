import { queryItems } from "../common/type";

export interface createCategory {
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
}

export interface updateCategory extends createCategory {}

export interface getAllCategory extends queryItems {
  name?: string;
  slug?: string;
  collections?: boolean;
}
