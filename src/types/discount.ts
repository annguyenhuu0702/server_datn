import { queryItems } from "../common/type";

export interface createDiscount {
  name: string;
  productCategoryId: number[];
  startday: Date;
  endday: Date;
  percent: number;
}

export interface updateDiscount extends createDiscount {}

export interface getAllDiscount extends queryItems {
  name?: string;
}
