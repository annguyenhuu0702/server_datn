import { ILike, In } from "typeorm";
import { resData, resMessage, resType } from "../common/type";
import { AppDataSource } from "../db";
import { Discount } from "../entities/Discount";
import { ProductCategory } from "../entities/ProductCategory";
import { createDiscount, getAllDiscount } from "../types/discount";
import { Product } from "../entities/Product";

interface ResDiscount extends Discount {
  productCategories: ProductCategory[];
}

export const discount_services = {
  getProductCategories: async (productsId: number[]) => {
    const data = await Product.find({
      where: {
        id: In(productsId),
      },
      relations: {
        productCategory: true,
      },
    });
    return data.map((item) => item.productCategory);
  },
  getAll: async (
    query: getAllDiscount
  ): Promise<resData<ResDiscount[]> | resMessage> => {
    const { name, p, limit } = query;
    try {
      const [data, count] = (await Discount.findAndCount({
        where: {
          ...(name
            ? {
                name: ILike(`%${name}%`),
              }
            : {}),
        },
        ...(limit ? { take: parseInt(limit) } : {}),
        ...(p && limit ? { skip: parseInt(limit) * (parseInt(p) - 1) } : {}),
        order: {
          id: "DESC",
        },
      })) as [ResDiscount[], number];

      for (let i = 0; i < data.length; i++) {
        let productCategories = await discount_services.getProductCategories(
          data[i].productsId
        );
        data[i].productCategories = productCategories;
        data[i].productCategories = [
          ...new Map(productCategories.map((m) => [m.id, m])).values(),
        ];
      }
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
      return {
        status: 500,
        data: {
          message: "Error",
        },
      };
    }
  },
  create: async (
    body: createDiscount
  ): Promise<resType<Discount> | resMessage> => {
    try {
      const findProductCategory = await ProductCategory.find({
        where: {
          id: In(body.productCategoryId),
        },
      });
      const findProduct = await Product.find({
        where: {
          productCategoryId: In(findProductCategory.map((item) => item.id)),
        },
      });
      await Promise.all(
        findProduct.map((item) => {
          let priceSale =
            item.price -
            Math.round((item.price / 1000) * (body.percent / 100)) * 1000;
          return Product.save({
            ...item,
            priceSale,
          });
        })
      );
      const data = await Discount.save({
        name: body.name,
        startday: body.startday,
        endday: body.endday,
        percent: body.percent,
        productsId: findProduct.map((item) => item.id),
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
  delete: async (id: string): Promise<resMessage> => {
    try {
      await AppDataSource.getRepository(Discount).softDelete({
        id: parseInt(id),
      });
      return {
        status: 200,
        data: {
          message: "Delete success",
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
