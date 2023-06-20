import { ILike } from "typeorm";
import { resData, resMessage, resType } from "../common/type";
import { getCloudinary } from "../config/configCloudinary";
import { AppDataSource } from "../db";
import { Category } from "../entities/Category";
import {
  createCategory,
  getAllCategory,
  updateCategory,
} from "../types/category";

export const category_services = {
  create: async (
    body: createCategory
  ): Promise<resType<Category> | resMessage> => {
    try {
      const category = await Category.save({ ...body });
      return {
        status: 201,
        data: {
          data: category,
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
  update: async (id: string, body: updateCategory): Promise<resMessage> => {
    try {
      const item = await Category.findOne({
        where: {
          id: parseInt(id),
        },
      });
      await Category.update(
        {
          id: parseInt(id),
        },
        body
      );
      if (item) {
        if (item.thumbnail && item.thumbnail !== body.thumbnail) {
          await getCloudinary().v2.uploader.destroy(
            "canifa" + item.thumbnail.split("canifa")[1].split(".")[0]
          );
        }
      }
      await Category.save({
        ...item,
        ...body,
      });
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
  delete: async (id: string): Promise<resMessage> => {
    try {
      const item = await AppDataSource.getRepository(Category).findOneBy({
        id: parseInt(id),
      });
      if (item) {
        if (item.thumbnail && item.thumbnail !== "") {
          await getCloudinary().v2.uploader.destroy(
            "canifa" + item.thumbnail.split("canifa")[1].split(".")[0]
          );
        }
        await AppDataSource.getRepository(Category).softDelete({ id: item.id });
      }
      return {
        status: 200,
        data: {
          message: "Delete successfully",
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
    query: getAllCategory
  ): Promise<resData<Category[]> | resMessage> => {
    try {
      const { p, limit, name, collections, slug } = query;
      const [data, count] = await Category.findAndCount({
        where: {
          ...(name
            ? {
                name: ILike(`%${name}%`),
              }
            : {}),
          ...(slug
            ? {
                slug,
              }
            : {}),
        },
        relations: {
          ...(collections
            ? {
                collections: {
                  productCategories: {
                    products: true,
                  },
                },
              }
            : {}),
        },
        withDeleted: false,
        ...(limit ? { take: parseInt(limit) } : {}),
        ...(p && limit ? { skip: parseInt(limit) * (parseInt(p) - 1) } : {}),
        order: {
          createdAt: "DESC",
          ...(collections
            ? {
                collections: {
                  createdAt: "DESC",
                  productCategories: {
                    createdAt: "DESC",
                    products: {
                      createdAt: "DESC",
                    },
                  },
                },
              }
            : {}),
        },
      });
      return {
        status: 200,
        data: {
          data: {
            rows: data,
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
  getById: async (id: string): Promise<resType<Category> | resMessage> => {
    try {
      const category = await Category.findOne({
        where: {
          id: parseInt(id),
        },
        relations: {
          collections: {
            productCategories: {
              products: true,
            },
          },
        },
      });
      if (!category) {
        return {
          status: 404,
          data: {
            message: "Category not found!",
          },
        };
      }
      return {
        status: 200,
        data: {
          data: category,
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
};
