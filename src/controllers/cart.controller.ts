import { Request, Response } from "express";
import { cart_services } from "../services/cart.services";

export const cart_controller = {
  getAll: async (req: Request, res: Response) => {
    const { data, status } = await cart_services.getAll();
    return res.status(status).json(data);
  },
  create: async (req: Request, res: Response) => {
    const { data, status } = await cart_services.create(req.body);
    return res.status(status).json(data);
  },
  getByUser: async (req: Request, res: Response) => {
    const { data, status } = await cart_services.getByUser(res.locals.user.id);
    return res.status(status).json(data);
  },
};
