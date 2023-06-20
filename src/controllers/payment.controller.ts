import { Request, Response } from "express";
import { payment_services } from "../services/payment.services";

export const payment_controller = {
  getAllPaymentItem: async (req: Request, res: Response) => {
    const { data, status } = await payment_services.getAllPaymentItem();
    return res.status(status).json(data);
  },
  getAll: async (req: Request, res: Response) => {
    const { data, status } = await payment_services.getAll(req.query);
    return res.status(status).json(data);
  },
  getById: async (req: Request, res: Response) => {
    const { data, status } = await payment_services.getById(req.params.id);
    return res.status(status).json(data);
  },
  getByUser: async (req: Request, res: Response) => {
    const { data, status } = await payment_services.getByUser(
      res.locals.user.id,
      req.query
    );
    return res.status(status).json(data);
  },
  create: async (req: Request, res: Response) => {
    const { data, status } = await payment_services.create(
      req.body,
      res.locals.user.id
    );
    return res.status(status).json(data);
  },
  createNoLogin: async (req: Request, res: Response) => {
    const { data, status } = await payment_services.createNoLogin(req.body);
    return res.status(status).json(data);
  },
  update: async (req: Request, res: Response) => {
    const { data, status } = await payment_services.update(
      req.params.id,
      req.body
    );
    return res.status(status).json(data);
  },
  delete: async (req: Request, res: Response) => {
    const { data, status } = await payment_services.delete(req.params.id);
    return res.status(status).json(data);
  },
  checkPoint: async (req: Request, res: Response) => {
    const { data, status } = await payment_services.checkPoint(
      req.body.point,
      res.locals.user.id
    );
    return res.status(status).json(data);
  },

  getRevenueMonth: async (req: Request, res: Response) => {
    const { data, status } = await payment_services.getRevenueMonth(req.query);
    return res.status(status).json(data);
  },

  getRevenueYear: async (req: Request, res: Response) => {
    const { data, status } = await payment_services.getRevenueYear(req.query);
    return res.status(status).json(data);
  },

  create_url: async (req: Request, res: Response) => {
    const { data } = await payment_services.create_url(req.query);
    return res.json(data);
  },

  // vnpay_return: async (req: Request, res: Response) => {
  //   const { data } = await payment_services.vnpay_return(req.query);
  //   return res.json(data);
  // },
};
