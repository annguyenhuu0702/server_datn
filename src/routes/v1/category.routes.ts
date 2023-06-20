import { Router } from "express";
import { category_controller } from "../../controllers/category.controller";
import { auth_middlewares } from "../../middlewares/auth.middleware";

const router = Router();
router.post(
  "/create",
  auth_middlewares.verifyAdmin,
  category_controller.create
);
router.put(
  "/update/:id",
  auth_middlewares.verifyAdmin,
  category_controller.update
);
router.delete(
  "/delete/:id",
  auth_middlewares.verifyAdmin,
  category_controller.delete
);
router.get("/getAll", category_controller.getAll);
router.get("/getById/:id", category_controller.getById);

export default router;
