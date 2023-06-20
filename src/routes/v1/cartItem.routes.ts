import { Router } from "express";
import { cartItem_controller } from "../../controllers/cartItem.controller";
import { auth_middlewares } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/create",
  auth_middlewares.loginRequire,
  cartItem_controller.create
);

router.put(
  "/update/:id",
  auth_middlewares.loginRequire,
  cartItem_controller.update
);

router.delete(
  "/delete/:id",
  auth_middlewares.loginRequire,
  cartItem_controller.delete
);

export default router;
