import { resData, resMessage, resType } from "../common/type";
import { Variant } from "../entities/Variant";
import { createVariant, getAllVariant, updateVariant } from "../types/variant";

export const variant_services = {
  create: async (
    body: createVariant
  ): Promise<resType<Variant> | resMessage> => {
    try {
      const data = await Variant.save({
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
  getAll: async (
    query: getAllVariant
  ): Promise<resData<Variant[]> | resMessage> => {
    try {
      const { p, limit } = query;
      const [variants, count] = await Variant.findAndCount({
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
            rows: variants,
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
