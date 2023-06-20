import { Request, Response } from "express";
import { comment_services } from "../services/comment.services";

export const comment_controller = {
  getAll: async (req: Request, res: Response) => {
    const { data, status } = await comment_services.getAll(req.query);
    return res.status(status).json(data);
  },
  getByProduct: async (req: Request, res: Response) => {
    const { data, status } = await comment_services.getByProduct(
      req.params.productId
    );
    return res.status(status).json(data);
  },
  create: async (req: Request, res: Response) => {
    const { data, status } = await comment_services.create(
      req.body,
      res.locals.user.id
    );
    return res.status(status).json(data);
  },
  update: async (req: Request, res: Response) => {
    const { data, status } = await comment_services.update(
      req.params.id,
      req.body
    );
    return res.status(status).json(data);
  },
  delete: async (req: Request, res: Response) => {
    const { data, status } = await comment_services.delete(req.params.id);
    return res.status(status).json(data);
  },
};
