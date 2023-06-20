import { ILike } from "typeorm";
import { resData, resMessage, resType } from "../common/type";
import { getCloudinary } from "../config/configCloudinary";
import { AppDataSource } from "../db";
import { News } from "../entities/News";
import { createNews, getAllNews, updateNews } from "../types/news";

export const news_services = {
  // abc
  getAll: async (query: getAllNews): Promise<resData<News[]> | resMessage> => {
    try {
      const { p, limit, title } = query;
      const [data, count] = await News.findAndCount({
        where: {
          ...(title
            ? {
                title: ILike(`%${title}%`),
              }
            : {}),
        },
        ...(limit ? { take: parseInt(limit) } : {}),
        ...(p && limit ? { skip: parseInt(limit) * (parseInt(p) - 1) } : {}),
        order: {
          id: "DESC",
        },
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
  create: async (body: createNews): Promise<resType<News> | resMessage> => {
    try {
      const data = await News.save({ ...body });
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
  update: async (id: string, body: updateNews): Promise<resMessage> => {
    try {
      const item = await News.findOne({
        where: {
          id: parseInt(id),
        },
      });
      await News.update(
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
      await News.save({
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
      const item = await AppDataSource.getRepository(News).findOneBy({
        id: parseInt(id),
      });
      if (item) {
        if (item.thumbnail && item.thumbnail !== "") {
          await getCloudinary().v2.uploader.destroy(
            "canifa" + item.thumbnail.split("canifa")[1].split(".")[0]
          );
        }
        await AppDataSource.getRepository(News).softDelete({
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
  getById: async (id: string): Promise<resType<News> | resMessage> => {
    try {
      const news = await News.findOne({
        where: {
          id: parseInt(id),
        },
      });
      if (!news) {
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
          data: news,
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
  getBySlug: async (slug: string): Promise<resType<News> | resMessage> => {
    try {
      const news = await News.findOne({
        where: {
          slug,
        },
      });
      if (!news) {
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
          data: news,
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
