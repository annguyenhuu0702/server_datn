import { Request, Response } from "express";
import { news_services } from "../services/news.services";

export const news_controller = {
  getAll: async (req: Request, res: Response) => {
    const { data, status } = await news_services.getAll(req.query);
    return res.status(status).json(data);
  },
  getById: async (req: Request, res: Response) => {
    const { data, status } = await news_services.getById(req.params.id);
    return res.status(status).json(data);
  },
  getBySlug: async (req: Request, res: Response) => {
    const { data, status } = await news_services.getBySlug(req.params.slug);
    return res.status(status).json(data);
  },
  create: async (req: Request, res: Response) => {
    const { data, status } = await news_services.create(req.body);
    return res.status(status).json(data);
  },
  update: async (req: Request, res: Response) => {
    const { data, status } = await news_services.update(
      req.params.id,
      req.body
    );
    return res.status(status).json(data);
  },
  delete: async (req: Request, res: Response) => {
    const { data, status } = await news_services.delete(req.params.id);
    return res.status(status).json(data);
  },
};
