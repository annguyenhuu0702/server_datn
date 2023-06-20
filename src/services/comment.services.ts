import { ILike } from "typeorm";
import { resData, resMessage, resType } from "../common/type";
import { AppDataSource } from "../db";
import { Comment } from "../entities/Comment";
import { createComment, getAllComment, updateComment } from "../types/comment";
import { product_services } from "./product.services";

export const comment_services = {
  getAll: async (query: getAllComment): Promise<resData<any> | resMessage> => {
    try {
      const { p, limit, fullname } = query;
      const [data, count] = await Comment.findAndCount({
        where: {
          ...(fullname
            ? {
                user: {
                  fullname: ILike(`%${fullname}%`),
                },
              }
            : {}),
        },
        relations: {
          user: true,
        },
        ...(limit ? { take: parseInt(limit) } : {}),
        ...(p && limit ? { skip: parseInt(limit) * (parseInt(p) - 1) } : {}),
        order: {
          createdAt: "DESC",
        },
      });

      const newData = data.map((item) => {
        const { hash, ...others } = item.user;
        return { ...item, user: others };
      });
      return {
        status: 200,
        data: {
          data: {
            rows: newData,
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
  getByProduct: async (
    productId: string
  ): Promise<resData<any> | resMessage> => {
    try {
      const [data, count] = await Comment.findAndCount({
        where: {
          productId: parseInt(productId),
        },
        relations: {
          user: true,
        },
        order: {
          createdAt: "DESC",
        },
      });

      const newData = data.map((item) => {
        const { hash, ...others } = item.user;
        return { ...item, user: others };
      });

      return {
        status: 200,
        data: {
          data: {
            rows: newData,
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
  create: async (
    body: createComment,
    userId: number
  ): Promise<resType<Comment> | resMessage> => {
    try {
      const data = await Comment.save({
        userId,
        ...body,
      });
      await product_services.updateStar(body.productId);
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
  update: async (id: string, body: updateComment): Promise<resMessage> => {
    try {
      await Comment.update(
        {
          id: parseInt(id),
        },
        body
      );
      await product_services.updateStar(body.productId);

      return {
        status: 201,
        data: {
          message: "Update success",
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
      const data = await Comment.findOne({
        where: {
          id: parseInt(id),
        },
      });
      if (data) {
        await AppDataSource.getRepository(Comment).softDelete({
          id: parseInt(id),
        });
        await product_services.updateStar(data.productId);
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
};
