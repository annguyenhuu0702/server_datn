import { Router } from "express";
import { productCategory_controller } from "../../controllers/productCategory.controller";
import { auth_middlewares } from "../../middlewares/auth.middleware";

const router = Router();
router.post(
  "/create",
  auth_middlewares.verifyAdmin,
  productCategory_controller.create
);
router.put(
  "/update/:id",
  auth_middlewares.verifyAdmin,
  productCategory_controller.update
);
router.delete(
  "/delete/:id",
  auth_middlewares.verifyAdmin,
  productCategory_controller.delete
);
router.get("/getAll", productCategory_controller.getAll);
router.get("/getById/:id", productCategory_controller.getById);

export default router;
