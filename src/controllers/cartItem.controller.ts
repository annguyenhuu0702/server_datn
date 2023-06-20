import { Request, Response } from "express";
import { cartItem_services } from "../services/cartItem.services";

export const cartItem_controller = {
  create: async (req: Request, res: Response) => {
    const { data, status } = await cartItem_services.create(
      req.body,
      res.locals.user.id
    );
    return res.status(status).json(data);
  },
  update: async (req: Request, res: Response) => {
    const { data, status } = await cartItem_services.update(
      req.params.id,
      req.body,
      res.locals.user.id
    );
    return res.status(status).json(data);
  },
  delete: async (req: Request, res: Response) => {
    const { data, status } = await cartItem_services.delete(
      req.params.id,
      res.locals.user.id
    );
    return res.status(status).json(data);
  },
};
