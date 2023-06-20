import { resData, resMessage, resType } from "../common/type";
import { getCloudinary } from "../config/configCloudinary";
import { AppDataSource } from "../db";
import { Product } from "../entities/Product";
import { ProductImage } from "../entities/ProductImage";
import { createProductImage, getAllProductImage } from "../types/productImage";
import { In } from "typeorm";

export const productImage_services = {
  createMany: async (
    body: createProductImage
  ): Promise<resType<ProductImage[]> | resMessage> => {
    try {
      const { productId, listId, pathImgs, thumbnail, updateImages } = body;
      // update màu
      if (updateImages.length > 0) {
        await AppDataSource.getRepository(ProductImage).save(updateImages);
      }
      // update ảnh đại diện
      if (thumbnail !== "") {
        await AppDataSource.getRepository(Product).update(
          {
            id: productId,
          },
          {
            thumbnail,
          }
        );
      }
      //xóa ảnh
      if (listId.length > 0) {
        const product = await AppDataSource.getRepository(Product).findOneBy({
          id: productId,
        });
        const promises: Array<Promise<any>> = [];
        const items = await ProductImage.find({
          where: {
            id: In(listId),
          },
        });
        items.forEach((item) => {
          if (item.path === product?.thumbnail) {
            promises.push(
              AppDataSource.getRepository(Product).update(
                {
                  id: productId,
                },
                {
                  thumbnail: "",
                }
              )
            );
          }
          promises.push(
            getCloudinary().v2.uploader.destroy(
              "canifa" + item.path.split("canifa")[1].split(".")[0]
            )
          );
        });
        await AppDataSource.getRepository(ProductImage).delete(listId);
        await Promise.all(promises);
      }
      // thêm ảnh mới
      if (pathImgs.length > 0) {
        await AppDataSource.getRepository(ProductImage).save(
          pathImgs.map((item) => ({
            ...item,
            productId,
          }))
        );
      }
      return {
        status: 201,
        data: {
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
    query: getAllProductImage
  ): Promise<resData<ProductImage[]> | resMessage> => {
    try {
      const { p, limit, productId } = query;
      const [productImages, count] = await ProductImage.findAndCount({
        where: {
          ...(productId ? { productId: +productId } : {}),
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
            rows: productImages,
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
