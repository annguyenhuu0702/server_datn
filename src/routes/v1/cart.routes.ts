import { Router } from "express";
import { cart_controller } from "../../controllers/cart.controller";
import { auth_middlewares } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/getAll", cart_controller.getAll);
router.post("/create", cart_controller.create);
router.get(
  "/getByUser",
  auth_middlewares.loginRequire,
  cart_controller.getByUser
);

export default router;
