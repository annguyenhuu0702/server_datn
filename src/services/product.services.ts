import {
  Between,
  ILike,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
} from "typeorm";
import { makeid } from "../common";
import { resData, resMessage, resType } from "../common/type";
import { getCloudinary } from "../config/configCloudinary";
import { AppDataSource } from "../db";
import { Collection } from "../entities/Collection";
import { Discount } from "../entities/Discount";
import { Product } from "../entities/Product";
import { ProductCategory } from "../entities/ProductCategory";
import {
  createProduct,
  getAllProduct,
  getByCategory,
  searchProduct,
  updateProduct,
} from "../types/product";
import { Comment } from "../entities/Comment";
import { PaymentItem } from "../entities/PaymentItem";
import { FavoriteProduct } from "../entities/LoveProduct";
import { Client } from "@elastic/elasticsearch";
import { User } from "../entities/User";

let events = require("events");
events.EventEmitter.defaultMaxListeners = 100;

export const product_services = {
  updateStar: async (productId: number) => {
    try {
      const [comments, count] = await Comment.findAndCount({
        where: {
          productId,
        },
      });

      await Product.update(
        {
          id: productId,
        },
        {
          totalStar: comments.reduce((prev, acc) => prev + acc.rating, 0),
        }
      );
    } catch (error) {
      console.log(error);
    }
  },

  updatePriceSale: async (products: Product[]) => {
    const checkdiscount = await Discount.find({
      where: {
        endday: LessThan(new Date()),
      },
    });

    // code lúc trước
    // return Promise.all(
    //   products.map((product) =>
    //     Product.save({
    //       ...product,
    //       priceSale:
    //         checkdiscount.findIndex((discount) =>
    //           discount.productsId.includes(product.id)
    //         ) !== -1
    //           ? 0
    //           : product.priceSale,
    //     })
    //   )
    // );

    // code mới
    await Promise.all(
      products.map((product) =>
        Product.update(
          {
            id: product.id,
          },
          {
            // ...product,
            priceSale:
              checkdiscount.findIndex((discount) =>
                discount.productsId.includes(product.id)
              ) !== -1
                ? 0
                : product.priceSale,
          }
        )
      )
    );
    return Promise.all(
      products.map(
        (product) =>
          Product.findOne({
            where: {
              id: product.id,
            },
            relations: {
              productCategory: {
                collection: {
                  category: true,
                },
              },
              productImages: true,
              productVariants: {
                product: true,
                variantValues: true,
              },
            },
          }) as any
      )
    );
  },
  create: async (
    body: createProduct
  ): Promise<resType<Product> | resMessage> => {
    try {
      const client = new Client({
        cloud: {
          id: "DATN:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyQ2OTJjODU3YWYwYzU0NzhhOGVjY2YyMWI4MGU4YTY5NCQwNDQ1OWE2NTcyYmI0ZGExYTRjNzU3NmEzMTIzZmZhNg==",
        },
        auth: {
          username: "elastic",
          password: "jA4Lwj1ld76A5JsmWwgmo7md",
        },
      });
      const product = await Product.save({ ...body, code: makeid(9) });
      const newData = await Product.findOne({
        where: {
          id: product.id,
        },
        relations: {
          productCategory: true,
          productImages: true,
          productVariants: {
            product: true,
            variantValues: true,
          },
        },
      });

      client.index({
        index: "productv3",
        id: `${newData?.id}`,
        document: {
          ...newData,
        },
      });

      return {
        status: 201,
        data: {
          data: newData,
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
  update: async (id: string, body: updateProduct): Promise<resMessage> => {
    const item = await Product.findOne({
      where: {
        id: parseInt(id),
      },
    });
    await Product.update(
      {
        id: parseInt(id),
      },
      body
    );
    const newProduct = await Product.save({
      ...item,
      ...body,
    });

    const newData = await Product.findOne({
      where: {
        id: newProduct.id,
      },
      relations: {
        productCategory: true,
        productImages: true,
        productVariants: {
          product: true,
          variantValues: true,
        },
      },
    });

    const client = new Client({
      cloud: {
        id: "DATN:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyQ2OTJjODU3YWYwYzU0NzhhOGVjY2YyMWI4MGU4YTY5NCQwNDQ1OWE2NTcyYmI0ZGExYTRjNzU3NmEzMTIzZmZhNg==",
      },
      auth: {
        username: "elastic",
        password: "jA4Lwj1ld76A5JsmWwgmo7md",
      },
    });

    if (newData) {
      client.update({
        index: "productv3",
        id: `${newData.id}`,
        doc: {
          ...newData,
        },
      });
    }

    try {
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
      const item = await AppDataSource.getRepository(Product).findOneBy({
        id: parseInt(id),
      });

      if (item) {
        if (item.thumbnail && item.thumbnail !== "") {
          await getCloudinary().v2.uploader.destroy(
            "canifa" + item.thumbnail.split("canifa")[1].split(".")[0]
          );
        }
        await AppDataSource.getRepository(Product).softDelete({
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
    query: getAllProduct
  ): Promise<resData<Product[]> | resMessage> => {
    try {
      const {
        p,
        limit,
        name,
        slug,
        otherSlug,
        sortBy,
        sortType,
        min,
        max,
        colorsId,
        sizesId,
      } = query;

      const client = new Client({
        cloud: {
          id: "DATN:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyQ2OTJjODU3YWYwYzU0NzhhOGVjY2YyMWI4MGU4YTY5NCQwNDQ1OWE2NTcyYmI0ZGExYTRjNzU3NmEzMTIzZmZhNg==",
        },
        auth: {
          username: "elastic",
          password: "jA4Lwj1ld76A5JsmWwgmo7md",
        },
      });

      // await client.indices.delete({
      //   index: "product",
      // });

      // await client.indices.refresh({ index: "product" });

      let [data, count] = await Product.findAndCount({
        where: {
          isActive: false,
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
          ...(otherSlug
            ? {
                productCategory: [
                  {
                    slug: otherSlug,
                  },
                  {
                    collection: {
                      slug: otherSlug,
                    },
                  },
                  {
                    collection: {
                      category: {
                        slug: otherSlug,
                      },
                    },
                  },
                ],
              }
            : {}),
          ...(min && !max
            ? {
                price: MoreThanOrEqual(+min),
              }
            : {}),

          ...(max && !min
            ? {
                price: LessThanOrEqual(+max),
              }
            : {}),

          ...(min && max
            ? {
                price: Between(+min, +max),
              }
            : {}),
          ...(colorsId || sizesId
            ? {
                productVariants: {
                  variantValues: {
                    id: In(
                      [
                        ...(colorsId || "").split(","),
                        ...(sizesId || "").split(","),
                      ].map((item) => +item)
                    ),
                  },
                },
              }
            : {}),
        },
        withDeleted: false,
        // ...(limit ? { take: parseInt(limit) } : {}),
        // ...(p && limit ? { skip: parseInt(limit) * (parseInt(p) - 1) } : {}),
        relations: {
          productCategory: true,
          productImages: true,
          productVariants: {
            product: true,
            variantValues: true,
          },
        },
        // order: { [sortBy || "createdAt"]: sortType || "DESC" },
      });

      // if (data) {
      //   const fetchData = async () => {
      //     await Promise.all(
      //       data.map((item) =>
      //         client.index({
      //           index: "productv3",
      //           id: `${item.id}`,
      //           document: {
      //             ...item,
      //           },
      //         })
      //       )
      //     );
      //   };
      //   await fetchData();
      // }

      data = await Product.find({
        where: {
          id: In(data.map((item) => item.id)),
        },
        ...(limit ? { take: parseInt(limit) } : {}),
        ...(p && limit ? { skip: parseInt(limit) * (parseInt(p) - 1) } : {}),
        relations: {
          productCategory: true,
          productImages: true,
          productVariants: {
            product: true,
            variantValues: true,
          },
        },
        order: { [sortBy || "createdAt"]: sortType || "DESC" },
      });

      return {
        status: 200,
        data: {
          data: {
            rows: await product_services.updatePriceSale(data),
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
  getAllAdmin: async (
    query: getAllProduct
  ): Promise<resData<Product[]> | resMessage> => {
    try {
      const {
        p,
        limit,
        name,
        slug,
        otherSlug,
        sortBy,
        sortType,
        min,
        max,
        colorsId,
        sizesId,
      } = query;

      let [data, count] = await Product.findAndCount({
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
          ...(otherSlug
            ? {
                productCategory: [
                  {
                    slug: otherSlug,
                  },
                  {
                    collection: {
                      slug: otherSlug,
                    },
                  },
                  {
                    collection: {
                      category: {
                        slug: otherSlug,
                      },
                    },
                  },
                ],
              }
            : {}),
          ...(min && !max
            ? {
                price: MoreThanOrEqual(+min),
              }
            : {}),

          ...(max && !min
            ? {
                price: LessThanOrEqual(+max),
              }
            : {}),

          ...(min && max
            ? {
                price: Between(+min, +max),
              }
            : {}),
          ...(colorsId || sizesId
            ? {
                productVariants: {
                  variantValues: {
                    id: In(
                      [
                        ...(colorsId || "").split(","),
                        ...(sizesId || "").split(","),
                      ].map((item) => +item)
                    ),
                  },
                },
              }
            : {}),
        },
        withDeleted: false,
        // ...(limit ? { take: parseInt(limit) } : {}),
        // ...(p && limit ? { skip: parseInt(limit) * (parseInt(p) - 1) } : {}),
        relations: {
          productCategory: true,
          productImages: true,
          productVariants: {
            product: true,
            variantValues: true,
          },
        },
        // order: { [sortBy || "createdAt"]: sortType || "DESC" },
      });

      data = await Product.find({
        where: {
          id: In(data.map((item) => item.id)),
        },
        ...(limit ? { take: parseInt(limit) } : {}),
        ...(p && limit ? { skip: parseInt(limit) * (parseInt(p) - 1) } : {}),
        relations: {
          productCategory: true,
          productImages: true,
          productVariants: {
            product: true,
            variantValues: true,
          },
        },
        order: { [sortBy || "createdAt"]: sortType || "DESC" },
      });

      return {
        status: 200,
        data: {
          data: {
            rows: await product_services.updatePriceSale(data),
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
  getById: async (id: string): Promise<resType<Product> | resMessage> => {
    try {
      const product = await Product.findOne({
        where: {
          id: parseInt(id),
          isActive: false,
        },
        relations: {
          productCategory: true,
        },
      });
      if (!product) {
        return {
          status: 404,
          data: {
            message: "Product not found!",
          },
        };
      }
      return {
        status: 200,
        data: {
          data: (await product_services.updatePriceSale([product]))[0],
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
  getByCategory: async (
    query: getByCategory,
    slug: string
  ): Promise<resData<any> | resMessage> => {
    const { limitCollection, limitProduct } = query;
    try {
      const collections = await Collection.find({
        where: {
          category: {
            slug,
          },
        },
        ...(limitCollection ? { take: parseInt(limitCollection) } : {}),
        relations: {
          category: true,
        },
      });

      const productsCategory = await Promise.all(
        collections.map((item) => {
          return ProductCategory.find({
            where: {
              collectionId: item.id,
            },
            order: {
              createdAt: "ASC",
            },
          });
        })
      );

      const products = await Promise.all(
        productsCategory.map((item) => {
          return Product.find({
            where: {
              productCategoryId: item && item.length > 0 ? item[0].id : 0,
              isActive: false,
            },
            relations: {
              productCategory: true,
              productImages: true,
              productVariants: {
                variantValues: true,
              },
            },
            ...(limitProduct ? { take: parseInt(limitProduct) } : {}),
          });
        })
      );
      const data: any = products.map((item) => {
        return {
          productCategory: item.length > 0 ? item[0].productCategory : null,
          products: item,
        };
      });

      for (let i = 0; i < data.length; i++) {
        let products = data[i].products;
        products = await product_services.updatePriceSale(products);
        data[i].products = products;
      }
      const count = data.length;
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
  getBySlug: async (
    slug: string
  ): Promise<
    resType<{ product: Product; productsRelated: Product[] }> | resMessage
  > => {
    try {
      const product = await Product.findOne({
        where: {
          slug,
          isActive: false,
        },
        relations: {
          productCategory: {
            collection: {
              category: true,
            },
          },
          productImages: true,
          productVariants: {
            variantValues: true,
          },
        },
      });

      if (!product) {
        return {
          status: 404,
          data: {
            message: "Product not found!",
          },
        };
      }
      const productsRelated = await Product.find({
        where: {
          productCategoryId: product.productCategory.id,
          isActive: false,
        },
        take: 4,
        relations: {
          productCategory: {
            collection: {
              category: true,
            },
          },
          productImages: true,
          productVariants: {
            variantValues: true,
          },
        },
      });
      return {
        status: 200,
        data: {
          data: {
            product: (await product_services.updatePriceSale([product]))[0],
            productsRelated: await product_services.updatePriceSale(
              productsRelated
            ),
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

  getHomePage: async (): Promise<resType<any> | resMessage> => {
    try {
      const tshirt = await Product.find({
        where: {
          productCategoryId: 37,
          isActive: false,
        },
        take: 4,
        relations: {
          productCategory: true,
          productImages: true,
          productVariants: {
            variantValues: true,
          },
        },
      });

      const poloMan = await Product.find({
        where: {
          productCategoryId: 63,
          isActive: false,
        },
        take: 4,
        relations: {
          productCategory: true,
          productImages: true,
          productVariants: {
            variantValues: true,
          },
        },
      });
      return {
        status: 200,
        data: {
          data: {
            tshirt: await product_services.updatePriceSale(tshirt),
            short: await product_services.updatePriceSale(poloMan),
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

  getProductStar: async (): Promise<resData<Product[]> | resMessage> => {
    const [data, count] = await Product.findAndCount({
      where: {
        totalStar: MoreThan(0),
        isActive: false,
      },
      relations: {
        productCategory: true,
        productImages: true,
        productVariants: {
          variantValues: true,
        },
      },
      take: 10,
      order: {
        totalStar: "DESC",
      },
    });
    try {
      return {
        status: 200,
        data: {
          data: {
            rows: await product_services.updatePriceSale(data),
            count,
          },
          message: "Success",
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

  getProductSale: async (): Promise<resData<Product[]> | resMessage> => {
    const [data, count] = await Product.findAndCount({
      where: {
        priceSale: MoreThan(0),
        isActive: false,
      },
      relations: {
        productCategory: true,
        productImages: true,
        productVariants: {
          variantValues: true,
        },
      },
    });
    try {
      return {
        status: 200,
        data: {
          data: {
            rows: await product_services.updatePriceSale(data),
            count,
          },
          message: "Success",
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

  getProductSelling: async (): Promise<resData<Product[]> | resMessage> => {
    try {
      let data = await AppDataSource.getRepository(PaymentItem)
        .createQueryBuilder("items")
        .leftJoinAndSelect("items.productVariant", "pv")
        .leftJoinAndSelect("pv.product", "pr")
        .leftJoinAndSelect("items.payment", "p")
        .groupBy("pr.id")
        .select("sum(items.quantity)", "total")
        .addSelect("pr.id", "id")
        .where("p.status=:status", {
          status: "Đã giao hàng",
        })
        .andWhere("pr.isActive=:isActive", {
          isActive: false,
        })
        .orderBy("sum(items.quantity)", "DESC")
        .getRawMany();
      data = data.splice(0, 10);
      for (let i = 0; i < data.length; i++) {
        let newData = await Product.findOne({
          where: {
            id: data[i].id,
          },
          relations: {
            productCategory: true,
            productImages: true,
            productVariants: {
              variantValues: true,
            },
          },
        });

        data[i] = {
          ...data[i],
          ...newData,
        };
      }

      return {
        status: 200,
        data: {
          data: {
            rows: await product_services.updatePriceSale(data),
            count: 0,
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

  activeProduct: async (id: string, isActive: boolean): Promise<any> => {
    try {
      await Product.update(
        {
          id: parseInt(id),
        },
        {
          isActive: true,
        }
      );

      const newData = await Product.findOne({
        where: {
          id: parseInt(id),
        },
        relations: {
          productCategory: true,
          productImages: true,
          productVariants: {
            product: true,
            variantValues: true,
          },
        },
      });

      const client = new Client({
        cloud: {
          id: "DATN:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyQ2OTJjODU3YWYwYzU0NzhhOGVjY2YyMWI4MGU4YTY5NCQwNDQ1OWE2NTcyYmI0ZGExYTRjNzU3NmEzMTIzZmZhNg==",
        },
        auth: {
          username: "elastic",
          password: "jA4Lwj1ld76A5JsmWwgmo7md",
        },
      });

      if (newData) {
        client.update({
          index: "productv3",
          id: `${newData.id}`,
          doc: {
            ...newData,
          },
        });
      }
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

  searchProduct: async (query: searchProduct): Promise<any> => {
    const { keyword } = query;
    const client = new Client({
      cloud: {
        id: "DATN:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyQ2OTJjODU3YWYwYzU0NzhhOGVjY2YyMWI4MGU4YTY5NCQwNDQ1OWE2NTcyYmI0ZGExYTRjNzU3NmEzMTIzZmZhNg==",
      },
      auth: {
        username: "elastic",
        password: "jA4Lwj1ld76A5JsmWwgmo7md",
      },
    });
    try {
      // const data = await Product.find({
      //   where: {
      //     isActive: false,
      //   },
      //   // relations: {
      //   //   productCategory: true,
      //   //   productImages: true,
      //   //   productVariants: {
      //   //     variantValues: true,
      //   //   },
      //   // },
      // });

      // if (data) {
      //   const fetchData = async () => {
      //     await Promise.all(
      //       data.map((item) =>
      //         client.index({
      //           index: "product",
      //           document: {
      //             ...item,
      //           },
      //         })
      //       )
      //     );
      //   };
      //   await fetchData();
      // }

      // await client.indices.refresh({ index: "product" });

      const result = await client.search({
        index: "productv3",
        // from: 5,
        size: 30,
        query: {
          match: {
            name: keyword,
          },
        },
      });

      const uniqueData: any[] = [];
      const uniqueIds = new Set();

      result.hits.hits.forEach((hit: any) => {
        const source = hit._source;
        if (!uniqueIds.has(source.id)) {
          uniqueIds.add(source.id);
          uniqueData.push(source);
        }
      });

      const producstId = uniqueData.map((item) => item.id);

      const finishData = await Product.find({
        where: {
          id: In(producstId),
        },
      });

      const sortedData = producstId.map((id) =>
        finishData.find((product) => product.id === id)
      );

      return {
        status: 200,
        data: {
          data: {
            rows: sortedData,
            count: uniqueData.length,
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

  getAllNameProduct: async (): Promise<resData<any> | resMessage> => {
    try {
      let [data, count] = await Product.findAndCount({
        where: {
          isActive: false,
        },
        withDeleted: false,
        order: {
          createdAt: "DESC",
        },
      });

      const productNames = data.map((product) => product.name);
      return {
        status: 200,
        data: {
          data: {
            rows: productNames,
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

  getAllProductCategoryId: async (): Promise<resData<any> | resMessage> => {
    try {
      let [data, count] = await ProductCategory.findAndCount({
        where: {},
        withDeleted: false,
        order: {
          createdAt: "DESC",
        },
        relations: ["products"], // Include the "products" relation
      });

      const productCategory = data
        .filter((productCategory) => productCategory.products.length > 0) // Filter categories with products
        .map((productCategory) => {
          return {
            id: productCategory.id,
            name: productCategory.name,
          };
        });

      return {
        status: 200,
        data: {
          data: {
            rows: productCategory,
            count: productCategory.length,
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

  productRecommendationsbyUser: async (
    userId: any
  ): Promise<resData<Product[]> | resMessage> => {
    try {
      const user = await User.findOne({
        where: {
          id: parseInt(userId),
        },
      });
      if (user) {
        const productCategoryId = user.suggestion;
        const [data, count] = await Product.findAndCount({
          where: {
            productCategoryId: In(productCategoryId),
            isActive: false,
          },
          relations: {
            productCategory: true,
            productImages: true,
            productVariants: {
              product: true,
              variantValues: true,
            },
          },
          withDeleted: false,
          take: 30,
          order: {
            price: "ASC",
          },
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
      }
      return {
        status: 200,
        data: {
          message: "Success",
        },
      };
      // return {
      //   status: 200,
      //   data: {
      //     data: {
      //       rows: data,
      //       count: count,
      //     },
      //     message: "Success",
      //   },
      // };
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
