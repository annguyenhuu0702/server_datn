import { ILike, LessThan } from "typeorm";
import { resData, resMessage, resType } from "../common/type";
import { AppDataSource } from "../db";
import { ProductVariant } from "../entities/ProductVariant";
import {
  createProductVariant,
  getAllProductVariant,
  updateProductStock,
  updateProductVariant,
} from "../types/productVariant";

export const productVariant_services = {
  create: async (
    body: createProductVariant[]
  ): Promise<resType<ProductVariant[]> | resMessage> => {
    try {
      const data = await AppDataSource.getRepository(ProductVariant).save(body);
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
  update: async (body: updateProductVariant): Promise<resMessage> => {
    const { isProductVariants, productVariants } = body;
    try {
      await productVariant_services.create(productVariants);
      await Promise.all(
        isProductVariants.map((productVariant) =>
          ProductVariant.update(
            {
              id: productVariant.id,
            },
            {
              inventory: productVariant.inventory,
              name: productVariant.name,
            }
          )
        )
      );
      return {
        status: 200,
        data: {
          message: "Update successfully",
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

  getAll: async (
    query: getAllProductVariant
  ): Promise<resData<ProductVariant[]> | resMessage> => {
    try {
      const { p, limit, productId, name, code } = query;
      const [productVariants, count] = await ProductVariant.findAndCount({
        where: {
          ...(productId ? { productId: +productId } : {}),
          ...(name
            ? {
                product: {
                  name: ILike(`%${name}%`),
                },
              }
            : {}),
          ...(code
            ? {
                product: {
                  code: ILike(`%${code}%`),
                },
              }
            : {}),
        },
        relations: {
          variantValues: true,
          product: true,
        },
        withDeleted: false,
        ...(limit ? { take: parseInt(limit) } : {}),
        ...(p && limit ? { skip: parseInt(limit) * (parseInt(p) - 1) } : {}),
      });

      return {
        status: 200,
        data: {
          data: {
            rows: productVariants,
            count,
          },
          message: "Success",
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
  getAllProductOutOfStock: async (
    query: getAllProductVariant
  ): Promise<resData<ProductVariant[]> | resMessage> => {
    try {
      const { p, limit, productId, name, code } = query;
      const [productVariants, count] = await ProductVariant.findAndCount({
        where: {
          inventory: LessThan(40),
          product: {
            isActive: false,
          },
          ...(productId ? { productId: +productId } : {}),
          ...(name
            ? {
                product: {
                  name: ILike(`%${name}%`),
                },
              }
            : {}),
          ...(code
            ? {
                product: {
                  code: ILike(`%${code}%`),
                },
              }
            : {}),
        },
        relations: {
          variantValues: true,
          product: true,
        },
        withDeleted: false,
        ...(limit ? { take: parseInt(limit) } : {}),
        ...(p && limit ? { skip: parseInt(limit) * (parseInt(p) - 1) } : {}),
        order: {
          inventory: "ASC",
        },
      });

      return {
        status: 200,
        data: {
          data: {
            rows: productVariants,
            count,
          },
          message: "Success",
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

  updateInventory: async (
    id: string,
    body: updateProductStock
  ): Promise<resMessage> => {
    try {
      await ProductVariant.update(
        {
          id: parseInt(id),
        },
        body
      );
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
};
