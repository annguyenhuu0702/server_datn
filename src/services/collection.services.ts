import { ILike } from "typeorm";
import { resData, resMessage, resType } from "../common/type";
import { getCloudinary } from "../config/configCloudinary";
import { AppDataSource } from "../db";
import { Collection } from "../entities/Collection";
import {
  createCollection,
  getAllCollection,
  updateCollection,
} from "../types/collection";

export const colletion_services = {
  create: async (
    body: createCollection
  ): Promise<resType<Collection> | resMessage> => {
    try {
      const collection = await Collection.save({ ...body });

      return {
        status: 201,
        data: {
          data: collection,
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
  update: async (id: string, body: updateCollection): Promise<resMessage> => {
    try {
      const item = await Collection.findOne({
        where: {
          id: parseInt(id),
        },
      });
      await Collection.update(
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
      await Collection.save({
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
      const item = await AppDataSource.getRepository(Collection).findOneBy({
        id: parseInt(id),
      });
      if (item) {
        if (item.thumbnail && item.thumbnail !== "") {
          await getCloudinary().v2.uploader.destroy(
            "canifa" + item.thumbnail.split("canifa")[1].split(".")[0]
          );
        }
        await AppDataSource.getRepository(Collection).softDelete({
          id: item.id,
        });
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
    query: getAllCollection
  ): Promise<resData<Collection[]> | resMessage> => {
    try {
      const { p, limit, productCategories, name, slug } = query;
      const [data, count] = await Collection.findAndCount({
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
          category: productCategories
            ? { collections: { productCategories: true } }
            : true,
        },
        withDeleted: false,
        ...(limit ? { take: parseInt(limit) } : {}),
        ...(p && limit ? { skip: parseInt(limit) * (parseInt(p) - 1) } : {}),
        order: {
          createdAt: "DESC",
          ...(productCategories
            ? {
                category: {
                  createdAt: "DESC",
                  collections: {
                    createdAt: "DESC",
                    productCategories: {
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
  getById: async (id: string): Promise<resType<Collection> | resMessage> => {
    try {
      const collection = await Collection.findOne({
        where: {
          id: parseInt(id),
        },
        relations: {
          category: true,
        },
      });
      if (!collection) {
        return {
          status: 404,
          data: {
            message: "Not found!",
          },
        };
      }
      return {
        status: 200,
        data: {
          data: collection,
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
