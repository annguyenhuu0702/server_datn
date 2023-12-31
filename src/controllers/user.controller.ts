import { Request, Response } from "express";
import { user_services } from "../services/user.services";

export const user_controller = {
  updateSuggestion: async (req: Request, res: Response) => {
    const { data, status } = await user_services.updateSuggestion(
      req.params.id,
      req.body
    );
    return res.status(status).json(data);
  },
  create: async (req: Request, res: Response) => {
    const { data, status } = await user_services.create(req.body);
    return res.status(status).json(data);
  },
  update: async (req: Request, res: Response) => {
    const { data, status } = await user_services.update(
      req.params.id,
      req.body
    );
    return res.status(status).json(data);
  },
  delete: async (req: Request, res: Response) => {
    const { data, status } = await user_services.delete(req.params.id);
    return res.status(status).json(data);
  },
  getById: async (req: Request, res: Response) => {
    const { data, status } = await user_services.getById(req.params.id);
    return res.status(status).json(data);
  },
  getAll: async (req: Request, res: Response) => {
    const { data, status } = await user_services.getAll(req.query);
    return res.status(status).json(data);
  },
};
