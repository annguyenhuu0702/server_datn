import { Request, Response } from "express";
import { admin_services } from "../services/home.services";

export const admin_controller = {
  getHomeAdmin: async (req: Request, res: Response) => {
    const { data, status } = await admin_services.getHomeAdmin();
    return res.status(status).json(data);
  },
};
