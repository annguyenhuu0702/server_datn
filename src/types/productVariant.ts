import { queryItems } from "../common/type";
import { ProductVariant } from "../entities/ProductVariant";
import { VariantValue } from "../entities/VariantValue";

export interface createProductVariant {
  productId: number;
  name: string;
  inventory: number;
  variantValues: VariantValue[];
}

export interface updateProductVariant {
  productVariants: createProductVariant[];
  isProductVariants: ProductVariant[];
}

export interface getAllProductVariant extends queryItems {
  name?: string;
  code?: string;
  productId: string;
}

export interface updateProductStock {
  inventory: number;
}
