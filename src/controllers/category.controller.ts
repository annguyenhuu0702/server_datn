import { Request, Response } from "express";
import { category_services } from "../services/category.services";

export const category_controller = {
  create: async (req: Request, res: Response) => {
    const { data, status } = await category_services.create(req.body);
    return res.status(status).json(data);
  },
  update: async (req: Request, res: Response) => {
    const { data, status } = await category_services.update(
      req.params.id,
      req.body
    );
    return res.status(status).json(data);
  },
  delete: async (req: Request, res: Response) => {
    const { data, status } = await category_services.delete(req.params.id);
    return res.status(status).json(data);
  },
  getAll: async (req: Request, res: Response) => {
    const { data, status } = await category_services.getAll(req.query);
    return res.status(status).json(data);
  },
  getById: async (req: Request, res: Response) => {
    const { data, status } = await category_services.getById(req.params.id);
    return res.status(status).json(data);
  },
};
