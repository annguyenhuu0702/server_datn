import { Request, Response } from "express";
import { product_services } from "../services/product.services";

export const product_controller = {
  productRecommendationsbyUser: async (req: Request, res: Response) => {
    const { data, status } =
      await product_services.productRecommendationsbyUser(res.locals.user.id);
    return res.status(status).json(data);
  },

  getAllNameProduct: async (req: Request, res: Response) => {
    const { data, status } = await product_services.getAllNameProduct();
    return res.status(status).json(data);
  },

  getAllProductCategoryId: async (req: Request, res: Response) => {
    const { data, status } = await product_services.getAllProductCategoryId();
    return res.status(status).json(data);
  },

  searchProduct: async (req: Request, res: Response) => {
    const { data, status } = await product_services.searchProduct(req.query);
    return res.status(status).json(data);
  },

  create: async (req: Request, res: Response) => {
    const { data, status } = await product_services.create(req.body);
    return res.status(status).json(data);
  },
  update: async (req: Request, res: Response) => {
    const { data, status } = await product_services.update(
      req.params.id,
      req.body
    );
    return res.status(status).json(data);
  },
  delete: async (req: Request, res: Response) => {
    const { data, status } = await product_services.delete(req.params.id);
    return res.status(status).json(data);
  },
  getAll: async (req: Request, res: Response) => {
    const { data, status } = await product_services.getAll(req.query);
    return res.status(status).json(data);
  },
  getAllAdmin: async (req: Request, res: Response) => {
    const { data, status } = await product_services.getAllAdmin(req.query);
    return res.status(status).json(data);
  },
  getById: async (req: Request, res: Response) => {
    const { data, status } = await product_services.getById(req.params.id);
    return res.status(status).json(data);
  },
  getByCategory: async (req: Request, res: Response) => {
    const { data, status } = await product_services.getByCategory(
      req.query,
      req.params.slug
    );
    return res.status(status).json(data);
  },
  getBySlug: async (req: Request, res: Response) => {
    const { data, status } = await product_services.getBySlug(req.params.slug);
    return res.status(status).json(data);
  },

  getHomePage: async (req: Request, res: Response) => {
    const { data, status } = await product_services.getHomePage();
    return res.status(status).json(data);
  },

  getProductStar: async (req: Request, res: Response) => {
    const { data, status } = await product_services.getProductStar();
    return res.status(status).json(data);
  },

  getProductSale: async (req: Request, res: Response) => {
    const { data, status } = await product_services.getProductSale();
    return res.status(status).json(data);
  },

  getProductSelling: async (req: Request, res: Response) => {
    const { data, status } = await product_services.getProductSelling();
    return res.status(status).json(data);
  },

  activeProduct: async (req: Request, res: Response) => {
    const { data, status } = await product_services.activeProduct(
      req.params.id,
      req.body.isActive
    );
    return res.status(status).json(data);
  },
};
