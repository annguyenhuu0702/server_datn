import { Request, Response } from "express";
import { colletion_services } from "../services/collection.services";

export const collection_controller = {
  create: async (req: Request, res: Response) => {
    const { data, status } = await colletion_services.create(req.body);
    return res.status(status).json(data);
  },
  update: async (req: Request, res: Response) => {
    const { data, status } = await colletion_services.update(
      req.params.id,
      req.body
    );
    return res.status(status).json(data);
  },
  delete: async (req: Request, res: Response) => {
    const { data, status } = await colletion_services.delete(req.params.id);
    return res.status(status).json(data);
  },
  getAll: async (req: Request, res: Response) => {
    const { data, status } = await colletion_services.getAll(req.query);
    return res.status(status).json(data);
  },
  getById: async (req: Request, res: Response) => {
    const { data, status } = await colletion_services.getById(req.params.id);
    return res.status(status).json(data);
  },
};
