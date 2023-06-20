import { Comment } from "../entities/Comment";
import { Discount } from "../entities/Discount";
import { News } from "../entities/News";
import { Payment } from "../entities/Payment";
import { User } from "../entities/User";

export const admin_services = {
  getHomeAdmin: async (): Promise<any> => {
    try {
      const countUser = await User.count();
      const countOrder = await Payment.count();
      const countComment = await Comment.count();
      const countNews = await News.count();
      const countPromotion = await Discount.count();
      const orders = await Payment.find({
        where: {
          status: "Đã giao hàng",
        },
      });
      const totalPrice = orders.reduce((prev, curr) => {
        return prev + curr.totalPrice;
      }, 0);
      return {
        status: 200,
        data: {
          data: [
            {
              text: "Khách hàng",
              count: countUser,
              path: "/admin/user",
            },
            {
              text: "Đơn hàng",
              count: countOrder,
              path: "/admin/order",
            },
            {
              text: "Doanh thu",
              count: totalPrice,
              path: "/admin/statistical",
            },
            {
              text: "Đánh giá",
              count: countComment,
              path: "/admin/comment",
            },
            {
              text: "Tin tức",
              count: countNews,
              path: "/admin/news",
            },
            {
              text: "Khuyến mãi",
              count: countPromotion,
              path: "/admin/discount",
            },
          ],
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
};
