import { resMessage, resType } from "../common/type";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { ProductVariant } from "../entities/ProductVariant";
import { createCartItem, updateCartItem } from "../types/cartItem";

export const cartItem_services = {
  create: async (
    body: createCartItem,
    userId: number
  ): Promise<resType<any> | resMessage> => {
    try {
      // tìm cart theo userId
      // nếu có cart thì check productVariantId
      // nếu có productVariantId thì check item trong giỏ hàng theo cartId và productVariantId
      // nếu mà có productVariantId thì cập nhật số lượng không thì tạo mới cart
      let findCart = await Cart.findOne({
        where: {
          userId: userId,
        },
      });
      if (findCart) {
        const findProductVariant = await ProductVariant.findOne({
          where: {
            id: body.productVariantId,
          },
        });
        if (findProductVariant) {
          let checkCartItem = await CartItem.findOne({
            where: {
              cartId: findCart.id,
              productVariantId: findProductVariant.id,
            },
          });
          checkCartItem = await CartItem.save({
            ...checkCartItem,
            productVariantId: findProductVariant.id,
            cartId: findCart.id,
            quantity: checkCartItem
              ? checkCartItem.quantity + body.quantity
              : body.quantity,
          });

          return {
            status: 201,
            data: {
              data: checkCartItem,
              message: "Created success",
            },
          };
        }
      }
    } catch (error) {
      console.log(error);
    }
    return {
      status: 500,
      data: {
        message: "Error",
      },
    };
  },
  update: async (
    id: string,
    body: updateCartItem,
    userId: number
  ): Promise<resMessage> => {
    try {
      let findCart = await Cart.findOne({
        where: {
          userId,
        },
      });
      if (findCart) {
        if (body.quantity === 0) {
          await CartItem.delete({
            id: parseInt(id),
          });
        } else {
          await CartItem.update(
            {
              id: parseInt(id),
            },
            {
              quantity: body.quantity,
            }
          );
        }
      }
      return {
        status: 200,
        data: {
          message: "update successfully",
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
  delete: async (id: string, userId: number): Promise<resMessage> => {
    try {
      const findCart = await Cart.findOne({
        where: {
          userId,
        },
      });
      if (findCart) {
        await CartItem.delete({
          id: parseInt(id),
        });
      }
      return {
        status: 200,
        data: {
          message: "delete successfully",
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
