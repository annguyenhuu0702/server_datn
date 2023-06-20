import { ILike } from "typeorm";
import { resData, resMessage, resType } from "../common/type";
import { AppDataSource } from "../db";
import { VariantValue } from "../entities/VariantValue";
import {
  createVariantValue,
  updateVariantValue,
  getAllColor,
  getAllVariantValue,
} from "../types/variantValue";

export const variantValue_services = {
  create: async (
    body: createVariantValue
  ): Promise<resType<VariantValue> | resMessage> => {
    try {
      const data = await VariantValue.save({
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
  update: async (id: string, body: updateVariantValue): Promise<resMessage> => {
    try {
      const data = await VariantValue.findOne({
        where: {
          id: parseInt(id),
        },
      });
      if (!data) {
        return {
          status: 404,
          data: {
            message: "Not found",
          },
        };
      }
      await VariantValue.update(
        {
          id: parseInt(id),
        },
        body
      );
      return {
        status: 200,
        data: {
          message: "update success",
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
      await AppDataSource.getRepository(VariantValue).softDelete({
        id: parseInt(id),
      });
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
    query: getAllVariantValue
  ): Promise<resData<VariantValue[]> | resMessage> => {
    try {
      const { p, limit, variantName } = query;
      const [variantValues, count] = await VariantValue.findAndCount({
        withDeleted: false,
        ...(limit ? { take: parseInt(limit) } : {}),
        ...(p && limit ? { skip: parseInt(limit) * (parseInt(p) - 1) } : {}),
        order: {
          variantId: "DESC",
          createdAt: "DESC",
        },
        ...(variantName ? { variant: { name: variantName } } : {}),
      });
      return {
        status: 200,
        data: {
          data: {
            rows: variantValues,
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
  getAllColor: async (
    query: getAllColor
  ): Promise<resData<VariantValue[]> | resMessage> => {
    try {
      const { p, limit, name } = query;
      const [colors, count] = await VariantValue.findAndCount({
        where: {
          variantId: 2,
          ...(name
            ? {
                name: ILike(`${name}%`),
              }
            : {}),
        },

        withDeleted: false,
        ...(limit ? { take: parseInt(limit) } : {}),
        ...(p && limit ? { skip: parseInt(limit) * (parseInt(p) - 1) } : {}),
        order: {
          createdAt: "DESC",
        },
      });
      return {
        status: 200,
        data: {
          data: {
            rows: colors,
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
  getAllSize: async (
    query: getAllColor
  ): Promise<resData<VariantValue[]> | resMessage> => {
    try {
      const { p, limit, name } = query;
      const [sizes, count] = await VariantValue.findAndCount({
        where: {
          variantId: 1,
          ...(name
            ? {
                name: ILike(`${name}%`),
              }
            : {}),
        },
        withDeleted: false,
        ...(limit ? { take: parseInt(limit) } : {}),
        ...(p && limit ? { skip: parseInt(limit) * (parseInt(p) - 1) } : {}),
        order: {
          createdAt: "DESC",
        },
      });
      return {
        status: 200,
        data: {
          data: {
            rows: sizes,
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
};
