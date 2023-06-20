import { ILike } from "typeorm";
import { lastDay, makeid } from "../common";
import { resData, resMessage, resType } from "../common/type";
import { AppDataSource } from "../db";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { Payment } from "../entities/Payment";
import { PaymentItem } from "../entities/PaymentItem";
import { ProductVariant } from "../entities/ProductVariant";
import { User } from "../entities/User";
import { createPayment, getAllPayment, updatePayment } from "../types/payemnt";
import moment from "moment";
import qs from "qs";
import crypto from "crypto";
import { CouponUser } from "../entities/CouponUser";

export const payment_services = {
  getAllPaymentItem: async (): Promise<resData<Payment[]> | resMessage> => {
    try {
      // const data = await Payment.find({
      //   where: [
      //     {
      //       status: "Chờ xử lí",
      //     },
      //     {
      //       status: "Đang giao hàng",
      //     },
      //     {
      //       status: "Đã xác nhận",
      //     },
      //   ],
      // });
      const [data, count] = await Payment.findAndCount({
        where: [
          {
            status: "Chờ xử lí",
          },
          {
            status: "Đang giao hàng",
          },
          {
            status: "Đã xác nhận",
          },
        ],
        relations: {
          paymentItems: {
            productVariant: {
              product: true,
            },
          },
        },
        order: {
          createdAt: "DESC",
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
  getAll: async (
    query: getAllPayment
  ): Promise<resData<Payment[]> | resMessage> => {
    try {
      const { p, limit, phone, fullname, status } = query;
      const [data, count] = await Payment.findAndCount({
        where: {
          ...(fullname
            ? {
                fullname: ILike(`%${fullname}%`),
              }
            : {}),
          ...(phone
            ? {
                phone: ILike(`%${phone}%`),
              }
            : {}),

          ...(status
            ? {
                status: ILike(`%${status}%`),
              }
            : {}),
        },
        relations: {
          paymentItems: {
            productVariant: {
              product: true,
            },
          },
        },
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
  getByUser: async (
    userId: number,
    query: getAllPayment
  ): Promise<resData<Payment[]> | resMessage> => {
    try {
      const { p, limit } = query;
      const [data, count] = await Payment.findAndCount({
        where: {
          userId,
        },
        relations: {
          paymentItems: true,
        },
        ...(limit ? { take: parseInt(limit) } : {}),
        ...(p && limit ? { skip: parseInt(limit) * (parseInt(p) - 1) } : {}),
        order: {
          createdAt: "DESC",
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
  getById: async (id: string): Promise<resType<Payment> | resMessage> => {
    try {
      const data = await Payment.findOne({
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
      return {
        status: 200,
        data: {
          data: data,
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
  create: async (body: createPayment, userId: number): Promise<any> => {
    try {
      // xóa coupon
      if (body.couponId !== undefined) {
        await CouponUser.save({
          couponId: body.couponId,
          userId,
        });
      }

      // lấy giỏ hàng theo userId
      const cart = await Cart.findOne({
        where: {
          userId,
        },
      });

      // tìm cart item trong cart
      if (cart) {
        const cartItem = await CartItem.find({
          where: {
            cartId: cart.id,
          },
          relations: {
            productVariant: {
              product: true,
            },
          },
        });

        // tạo đơn hàng
        const payemnt = await Payment.create({
          ...body,
          userId,
        });

        const data = await Payment.save({
          ...payemnt,
        });

        const paymentItems = await AppDataSource.getRepository(
          PaymentItem
        ).save(
          cartItem.map((item) => ({
            productVariantId: item.productVariantId,
            price:
              item.productVariant.product.priceSale ||
              item.productVariant.product.price,
            paymentId: data.id,
            quantity: item.quantity,
          }))
        );

        // xóa cartItem khi đặt hàng
        await CartItem.delete({
          cartId: cart.id,
        });

        const checkUser = await User.findOne({
          where: {
            id: userId,
          },
        });

        if (checkUser) {
          await User.update(
            {
              id: checkUser.id,
            },
            {
              accumulatedPoints: checkUser.accumulatedPoints - body.point,
            }
          );
        }

        return {
          status: 201,
          data: {
            data,
            paymentItems,
            message: "Created success",
          },
        };
      }
    } catch (error) {
      console.log(error);
    }
    return {
      status: 500,
      data: {
        message: "Error",
      },
    };
  },

  // đặt hàng ko đăng nhập
  createNoLogin: async (body: any): Promise<any> => {
    const { productVariant, quantity, ...others } = body;
    try {
      const order = await Payment.save({
        ...others,
      });
      if (order) {
        await PaymentItem.save({
          paymentId: order.id,
          productVariantId: productVariant.id,
          price:
            productVariant.product.priceSale || productVariant.product.price,
          quantity,
        });
      }
      return {
        status: 201,
        data: {
          message: "Created success",
        },
      };
    } catch (error) {
      console.log(error);
    }

    return {
      status: 500,
      data: {
        message: "Error",
      },
    };
  },
  update: async (id: string, body: updatePayment): Promise<resMessage> => {
    try {
      await Payment.update(
        {
          id: parseInt(id),
        },
        body
      );

      const paymentItems = await PaymentItem.find({
        where: {
          paymentId: parseInt(id),
        },
        relations: {
          productVariant: true,
        },
      });

      // đã giao hàng thì trừ số lượng tồn, cập nhật điểm cho user
      if (body.status === "Đã giao hàng") {
        await Payment.update(
          {
            id: parseInt(id),
          },
          {
            isPaid: true,
          }
        );
        await AppDataSource.getRepository(ProductVariant).save(
          paymentItems.map((item) => ({
            ...item.productVariant,
            inventory: item.productVariant.inventory - item.quantity,
          }))
        );

        const payemnt = await Payment.findOne({
          where: {
            id: parseInt(id),
          },
        });

        if (payemnt) {
          const checkUser = await User.findOne({
            where: {
              id: payemnt.userId,
            },
          });
          if (checkUser) {
            await AppDataSource.getRepository(User).update(
              {
                id: checkUser.id,
              },
              {
                accumulatedPoints:
                  checkUser.accumulatedPoints + body.totalPrice / 1000,
              }
            );
          }
        }
      }
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
      await AppDataSource.getRepository(Payment).softDelete({
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

  checkPoint: async (point: number, userId: number): Promise<resMessage> => {
    try {
      const user = await User.findOne({
        where: {
          id: userId,
        },
      });
      if (user) {
        if (point > user?.accumulatedPoints) {
          return {
            status: 400,
            data: {
              message: "Điểm tích lũy của bạn không đủ!",
            },
          };
        }
      }
      if (user) {
        if (point <= user?.accumulatedPoints) {
          return {
            status: 200,
            data: {
              message: "Success",
            },
          };
        }
      }
    } catch (error) {
      console.log(error);
    }
    return {
      status: 500,
      data: {
        message: "Error",
      },
    };
  },
  getRevenueMonth: async (query: {
    month?: string;
    year?: string;
  }): Promise<any> => {
    const { month, year } = query;

    try {
      const data = await AppDataSource.getRepository(Payment)
        .createQueryBuilder("p")
        .groupBy(`date_part('day',"p"."updatedAt")`)
        .addGroupBy(`date_part('month',"p"."updatedAt")`)
        .addGroupBy(`date_part('year',"p"."updatedAt")`)
        .select(`sum("p"."totalPrice")`, "total")
        .addSelect(`date_part('day',"p"."updatedAt")`, "day")
        .addSelect(`date_part('month',"p"."updatedAt")`, "month")
        .addSelect(`date_part('year',"p"."updatedAt")`, "year")
        .where(`"p"."updatedAt" between :start and :end`, {
          start: new Date(`${year}-${month}-01`),
          end: new Date(`${year}-${month}-${lastDay(+`${month}`, +`${year}`)}`),
        })
        .andWhere(`"p"."status"=:status`, {
          status: "Đã giao hàng",
        })
        .orderBy(`date_part('day',"p"."updatedAt")`, "ASC")
        .getRawMany();

      return {
        status: 200,
        data: {
          data: data,
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

  getRevenueYear: async (query: { year?: string }): Promise<any> => {
    const { year } = query;

    try {
      const data = await AppDataSource.getRepository(Payment)
        .createQueryBuilder("p")
        .groupBy(`date_part('month',"p"."updatedAt")`)
        .addGroupBy(`date_part('year',"p"."updatedAt")`)
        .select(`sum("p"."totalPrice")`, "total")
        .addSelect(`date_part('month',"p"."updatedAt")`, "month")
        .addSelect(`date_part('year',"p"."updatedAt")`, "year")
        .where(`date_part('year',"p"."updatedAt")=:year`, {
          year: year,
        })
        .andWhere(`"p"."status"=:status`, {
          status: "Đã giao hàng",
        })
        .orderBy(`date_part('month',"p"."updatedAt")`, "ASC")
        .getRawMany();

      return {
        status: 200,
        data: {
          data: data,
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

  sortObject: (obj: any) => {
    let sorted: any = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  },

  create_url: async (q: any) => {
    let { amount } = q;
    let secretKey = process.env.vnp_HashSecret;
    let vnpUrl = process.env.vnp_Url;
    let vnp_ReturnUrl = process.env.vnp_ReturnUrl;
    let query: any = payment_services.sortObject({
      vnp_Amount: amount * 100,
      vnp_Command: "pay",
      vnp_CreateDate: parseInt(moment().format("YYYYMMDDHHmmss")),
      vnp_CurrCode: "VND",
      vnp_IpAddr: "27.71.108.110",
      vnp_Locale: "vn",
      vnp_OrderInfo: "Thanh toan don hang",
      vnp_OrderType: "other",
      vnp_ReturnUrl: vnp_ReturnUrl,
      vnp_TmnCode: process.env.vnp_TmnCode,
      vnp_TxnRef: parseInt(moment().format("YYYYMMDDHHmmss")),
      vnp_Version: "2.1.0",
    });
    // Sign sha256
    let signData = qs.stringify(query, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey || "");
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    query["vnp_SecureHash"] = signed;
    return {
      data: vnpUrl + "?" + qs.stringify(query, { encode: false }),
    };
  },

  // vnpay_return: async (query: any) => {
  //   let vnp_Params = query;
  //   let secureHash = vnp_Params["vnp_SecureHash"];
  //   delete vnp_Params["vnp_SecureHash"];
  //   delete vnp_Params["vnp_SecureHashType"];
  //   vnp_Params = payment_services.sortObject(vnp_Params);
  //   let tmnCode = process.env.vnp_TmnCode;
  //   let secretKey = process.env.vnp_HashSecret;
  //   let querystring = require("qs");
  //   let signData = querystring.stringify(vnp_Params, { encode: false });
  //   let crypto = require("crypto");
  //   let hmac = crypto.createHmac("sha512", secretKey);
  //   let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  //   if (secureHash === signed) {
  //     return {
  //       data: "http://localhost:1603/payment-success",
  //     };
  //   } else {
  //     return {
  //       data: "http://localhost:1603/payment-success",
  //     };
  //   }
  // },
};
