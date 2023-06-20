import { Request, Response } from "express";
import { productImage_services } from "../services/productImage.services";

export const productImage_controller = {
  createMany: async (req: Request, res: Response) => {
    const { data, status } = await productImage_services.createMany(req.body);
    return res.status(status).json(data);
  },

  getAll: async (req: Request, res: Response) => {
    const { data, status } = await productImage_services.getAll(
      req.query as any
    );
    return res.status(status).json(data);
  },
};
