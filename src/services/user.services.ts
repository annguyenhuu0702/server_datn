import { resData, resMessage, resType } from "../common/type";
import { User } from "../entities/User";
import {
  createUser,
  getAllUser,
  updateSuggestion,
  updateUser,
} from "../types/user";
import * as argon from "argon2";
import { AppDataSource } from "../db";
import { ILike } from "typeorm";
import { getCloudinary } from "../config/configCloudinary";
import { cart_services } from "./cart.services";

export const user_services = {
  updateSuggestion: async (
    id: string,
    body: updateSuggestion
  ): Promise<resMessage> => {
    try {
      await User.update(
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

  create: async (body: createUser): Promise<resType<any> | resMessage> => {
    try {
      const { email, password, ...others } = body;
      const isEmail = await User.findOneBy({
        email,
      });
      if (isEmail) {
        return {
          status: 403,
          data: {
            message: "Email already is exists",
          },
        };
      }
      const hash = await argon.hash(password);
      const data = await User.save({
        email,
        hash,
        ...others,
      });
      const { hash: _hash, ...other } = data;
      await cart_services.create({
        userId: other.id,
      });
      return {
        status: 201,
        data: { data: other, message: "Created success" },
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        data: { message: "Error" },
      };
    }
  },
  update: async (id: string, body: updateUser): Promise<resMessage> => {
    try {
      const item = await User.findOne({
        where: {
          id: parseInt(id),
        },
      });
      await User.update(
        {
          id: parseInt(id),
        },
        body
      );
      if (item) {
        if (item.avatar && item.avatar !== body.avatar) {
          await getCloudinary().v2.uploader.destroy(
            "canifa" + item.avatar.split("canifa")[1].split(".")[0]
          );
        }
      }
      await User.save({
        ...item,
        ...body,
      });
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
  delete: async (id: string): Promise<resMessage> => {
    try {
      const item = await AppDataSource.getRepository(User).findOneBy({
        id: parseInt(id),
      });
      if (item) {
        if (item.avatar && item.avatar !== "") {
          await getCloudinary().v2.uploader.destroy(
            "canifa" + item.avatar.split("canifa")[1].split(".")[0]
          );
        }
        await AppDataSource.getRepository(User).softDelete({ id: item.id });
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
  getById: async (id: string): Promise<resType<any> | resMessage> => {
    try {
      const user = await User.findOneBy({
        id: parseInt(id),
      });
      if (!user) {
        return {
          status: 404,
          data: {
            message: "User not found!!!!",
          },
        };
      }
      const { hash, ...others } = user;
      return {
        status: 200,
        data: {
          data: others,
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
  getAll: async (query: getAllUser): Promise<resData<any> | resMessage> => {
    try {
      const { p, limit, fullname, email, phone } = query;
      const users = await User.find({
        where: {
          role: "user",
          ...(fullname
            ? {
                fullname: ILike(`%${fullname}%`),
              }
            : {}),
          ...(email
            ? {
                email: ILike(`%${email}%`),
              }
            : {}),
          ...(phone
            ? {
                phone: ILike(`%${phone}%`),
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

      const data = users.map((item) => {
        const { hash, ...others } = item;
        return others;
      });
      const count = await User.countBy({
        role: "user",
      });
      return {
        status: 200,
        data: {
          data: {
            rows: data,
            count: count,
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
