import { Request, Response } from "express";
import { variantValue_services } from "../services/variantValue.services";

export const variantValue_controller = {
  create: async (req: Request, res: Response) => {
    const { data, status } = await variantValue_services.create(req.body);
    return res.status(status).json(data);
  },
  update: async (req: Request, res: Response) => {
    const { data, status } = await variantValue_services.update(
      req.params.id,
      req.body
    );
    return res.status(status).json(data);
  },
  delete: async (req: Request, res: Response) => {
    const { data, status } = await variantValue_services.delete(req.params.id);
    return res.status(status).json(data);
  },
  getAll: async (req: Request, res: Response) => {
    const { data, status } = await variantValue_services.getAll(
      req.query as any
    );
    return res.status(status).json(data);
  },
  getAllColor: async (req: Request, res: Response) => {
    const { data, status } = await variantValue_services.getAllColor(req.query);
    return res.status(status).json(data);
  },
  getAllSize: async (req: Request, res: Response) => {
    const { data, status } = await variantValue_services.getAllSize(req.query);
    return res.status(status).json(data);
  },
};
