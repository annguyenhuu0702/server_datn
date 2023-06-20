import { Request, Response } from "express";
import { auth_services } from "../services/auth.services";

export const auth_controller = {
  register: async (req: Request, res: Response) => {
    const { data, status } = await auth_services.register(req.body, res);
    return res.status(status).json(data);
  },
  login: async (req: Request, res: Response) => {
    const { data, status } = await auth_services.login(req.body, res);
    return res.status(status).json(data);
  },
  logout: async (res: Response) => {
    res.clearCookie("REFRESH_TOKEN");
    res.status(201).json({ message: "Success" });
  },
  fogotPassword: async (req: Request, res: Response) => {
    const { data, status } = await auth_services.fogotPassword(req.body);
    return res.status(status).json(data);
  },
  getEmailResetPassword: async (req: Request, res: Response) => {
    const { data, status } = await auth_services.getEmailResetPassword(
      req.params.id,
      req.params.token
    );
    return res.status(status).json(data);
  },
  resetPassword: async (req: Request, res: Response) => {
    const { data, status } = await auth_services.resetPassword(
      req.params.id,
      req.body
    );
    return res.status(status).json(data);
  },
  refreshToken: async (req: Request, res: Response) => {
    const { data, status } = await auth_services.refreshToken(req);
    return res.status(status).json(data);
  },
  getProfile: async (req: Request, res: Response) => {
    const { data, status } = await auth_services.getProfile(res.locals.user);
    return res.status(status).json(data);
  },
  changeProfile: async (req: Request, res: Response) => {
    const { data, status } = await auth_services.changeProfile(
      res.locals.user,
      req.body
    );
    return res.status(status).json(data);
  },
  changePassword: async (req: Request, res: Response) => {
    const { data, status } = await auth_services.changePassword(
      res.locals.user,
      req.body
    );
    return res.status(status).json(data);
  },
  changeEmail: async (req: Request, res: Response) => {
    const { data, status } = await auth_services.changeEmail(
      res.locals.user,
      req.body
    );
    return res.status(status).json(data);
  },
};
