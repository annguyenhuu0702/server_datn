import { Router } from "express";
import { productImage_controller } from "../../controllers/productImage.controller";
import { auth_middlewares } from "../../middlewares/auth.middleware";

const router = Router();
router.post(
  "/createMany",
  auth_middlewares.verifyAdmin,
  productImage_controller.createMany
);
router.get("/getAll", productImage_controller.getAll);

export default router;
