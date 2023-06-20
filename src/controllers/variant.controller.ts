import { Request, Response } from "express";
import { variant_services } from "../services/variant.services";

export const variant_controller = {
  create: async (req: Request, res: Response) => {
    const { data, status } = await variant_services.create(req.body);
    return res.status(status).json(data);
  },
  getAll: async (req: Request, res: Response) => {
    const { data, status } = await variant_services.getAll(req.query);
    return res.status(status).json(data);
  },
};
