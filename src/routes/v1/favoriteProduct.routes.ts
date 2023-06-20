import { Request, Response, Router } from "express";
import { favoriteProduct_controller } from "../../controllers/favoriteProduct.controller";
import { auth_middlewares } from "../../middlewares/auth.middleware";

const router = Router();
router.get(
  "/getProductFavorite",
  // auth_middlewares.loginRequire,
  favoriteProduct_controller.getProductFavorite
);
router.get(
  "/getAll",
  auth_middlewares.loginRequire,
  favoriteProduct_controller.getAll
);
router.post(
  "/create",
  auth_middlewares.loginRequire,
  favoriteProduct_controller.create
);
router.get(
  "/getByUser",
  auth_middlewares.loginRequire,
  favoriteProduct_controller.getByUser
);
router.delete(
  "/delete/:productId",
  auth_middlewares.loginRequire,
  favoriteProduct_controller.delete
);

export default router;
