import { queryItems } from "../common/type";

export interface createVariant {
  name: string;
}

export interface updateVariant extends createVariant {}

export interface getAllVariant extends queryItems {}
