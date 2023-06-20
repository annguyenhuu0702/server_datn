import { Request, Response } from "express";
import { discount_services } from "../services/discount.services";

export const discount_controller = {
  getAll: async (req: Request, res: Response) => {
    const { data, status } = await discount_services.getAll(req.query);
    return res.status(status).json(data);
  },
  create: async (req: Request, res: Response) => {
    const { data, status } = await discount_services.create(req.body);
    return res.status(status).json(data);
  },
  delete: async (req: Request, res: Response) => {
    const { data, status } = await discount_services.delete(req.params.id);
    return res.status(status).json(data);
  },
};
