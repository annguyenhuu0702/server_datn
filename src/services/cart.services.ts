import { resData, resMessage, resType } from "../common/type";
import { Cart } from "../entities/Cart";
import { createCart } from "../types/cart";

export const cart_services = {
  getAll: async (): Promise<resData<Cart[]> | resMessage> => {
    try {
      const [data, count] = await Cart.findAndCount();
      return {
        status: 200,
        data: {
          data: {
            rows: data,
            count,
          },
          message: "success",
        },
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        data: {
          message: "Error",
        },
      };
    }
  },
  create: async (body: createCart): Promise<resType<Cart> | resMessage> => {
    try {
      const data = await Cart.save({
        ...body,
      });
      return {
        status: 201,
        data: {
          data: data,
          message: "Created success",
        },
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        data: {
          message: "Error",
        },
      };
    }
  },
  getByUser: async (userId: number): Promise<resType<Cart> | resMessage> => {
    try {
      const data = await Cart.findOne({
        where: {
          userId,
        },
        relations: {
          cartItems: {
            productVariant: {
              variantValues: true,
              product: {
                productImages: true,
              },
            },
          },
        },
        order: {
          cartItems: {
            id: "DESC",
          },
        },
      });
      return {
        status: 200,
        data: {
          data: data,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        data: {
          message: "Error",
        },
      };
    }
  },
};
