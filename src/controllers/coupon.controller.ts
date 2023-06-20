import { Request, Response } from "express";
import { coupon_services } from "../services/coupon.services";

export const coupon_controller = {
  getAll: async (req: Request, res: Response) => {
    const { data, status } = await coupon_services.getAll(req.query);
    return res.status(status).json(data);
  },

  getCouponByUser: async (req: Request, res: Response) => {
    const { data, status } = await coupon_services.getCouponByUser(
      res.locals.user
    );
    return res.status(status).json(data);
  },

  create: async (req: Request, res: Response) => {
    const { data, status } = await coupon_services.create(req.body);
    return res.status(status).json(data);
  },

  chẹckCoupon: async (req: Request, res: Response) => {
    const { data, status } = await coupon_services.checkCoupon(
      res.locals.user,
      req.body
    );
    return res.status(status).json(data);
  },
};
