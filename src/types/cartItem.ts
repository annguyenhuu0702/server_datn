type createCartItem = {
  productVariantId: number;
  quantity: number;
};

type updateCartItem = {
  quantity: number;
};

export type { createCartItem, updateCartItem };
