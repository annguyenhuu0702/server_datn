import { Request, Response } from "express";
import { productVariant_services } from "../services/productVariant.services";

export const productVariant_controller = {
  create: async (req: Request, res: Response) => {
    const { data, status } = await productVariant_services.create(req.body);
    return res.status(status).json(data);
  },
  update: async (req: Request, res: Response) => {
    const { data, status } = await productVariant_services.update(req.body);
    return res.status(status).json(data);
  },

  getAll: async (req: Request, res: Response) => {
    const { data, status } = await productVariant_services.getAll(
      req.query as any
    );
    return res.status(status).json(data);
  },

  getAllProductOutOfStock: async (req: Request, res: Response) => {
    const { data, status } =
      await productVariant_services.getAllProductOutOfStock(req.query as any);
    return res.status(status).json(data);
  },

  updateInventory: async (req: Request, res: Response) => {
    const { data, status } = await productVariant_services.updateInventory(
      req.params.id,
      req.body
    );
    return res.status(status).json(data);
  },
};
