import { Router } from "express";
import { productVariant_controller } from "../../controllers/productVariant.controller";
import { auth_middlewares } from "../../middlewares/auth.middleware";

const router = Router();
router.post(
  "/create",
  auth_middlewares.verifyAdmin,
  productVariant_controller.create
);
router.put(
  "/update",
  auth_middlewares.verifyAdmin,
  productVariant_controller.update
);
router.get("/getAll", productVariant_controller.getAll);
router.get(
  "/getAllProductOutOfStock",
  productVariant_controller.getAllProductOutOfStock
);

router.put(
  "/updateInventory/:id",
  auth_middlewares.verifyAdmin,
  productVariant_controller.updateInventory
);

export default router;
