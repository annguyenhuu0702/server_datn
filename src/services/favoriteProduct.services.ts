import { In } from "typeorm";
import { resData, resMessage, resType } from "../common/type";
import { FavoriteProduct } from "../entities/LoveProduct";
import { Product } from "../entities/Product";
import {
  createFavoriteProduct,
  getAllFavoriteProduct,
} from "../types/favoriteProduct";

export const favoriteProduct_services = {
  getAll: async (
    query: getAllFavoriteProduct
  ): Promise<resData<FavoriteProduct[]> | resMessage> => {
    try {
      const { p, limit } = query;
      const [data, count] = await FavoriteProduct.findAndCount({
        ...(limit ? { take: parseInt(limit) } : {}),
        ...(p && limit ? { skip: parseInt(limit) * parseInt(p) - 1 } : {}),
      });
      return {
        status: 200,
        data: {
          data: {
            rows: data,
            count: count,
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
  create: async (
    body: createFavoriteProduct,
    userId: number
  ): Promise<resType<FavoriteProduct> | resMessage> => {
    try {
      const data = await FavoriteProduct.save({
        userId,
        productId: body.productId,
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
  delete: async (productId: string, userId: number): Promise<resMessage> => {
    try {
      await FavoriteProduct.delete({
        productId: parseInt(productId),
        userId,
      });
      return {
        status: 200,
        data: {
          message: "deleted success",
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
  getByUser: async (
    query: getAllFavoriteProduct,
    userId: number
  ): Promise<resData<FavoriteProduct[]> | resMessage> => {
    try {
      const { p, limit } = query;
      const [data, count] = await FavoriteProduct.findAndCount({
        where: {
          userId,
        },
        relations: {
          product: {
            productVariants: {
              variantValues: true,
            },
            productImages: true,
          },
        },
        ...(limit ? { take: parseInt(limit) } : {}),
        ...(p && limit ? { skip: parseInt(limit) * parseInt(p) - 1 } : {}),
      });
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

  // lấy sản phẩm yêu thích liên quan hiển ra trang chủ
  getProductFavorite: async (
    id: string
  ): Promise<resData<Product[]> | resMessage> => {
    try {
      const data = await FavoriteProduct.find({
        where: {
          userId: 30,
        },
        relations: {
          product: {
            productVariants: {
              variantValues: true,
            },
            productImages: true,
          },
        },
      });

      const product_category_id = data.map(
        (item) => item.product.productCategoryId
      );

      const [products, count] = await Product.findAndCount({
        where: {
          productCategoryId: In(product_category_id),
        },
        relations: {
          productVariants: {
            variantValues: true,
          },
          productImages: true,
        },
      });

      return {
        status: 200,
        data: {
          data: {
            rows: products,
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
};
