import { Router } from "express";
import { variantValue_controller } from "../../controllers/variantValue.controller";
import { auth_middlewares } from "../../middlewares/auth.middleware";

const router = Router();
router.post(
  "/create",
  auth_middlewares.verifyAdmin,
  variantValue_controller.create
);
router.put(
  "/update/:id",
  auth_middlewares.verifyAdmin,
  variantValue_controller.update
);
router.delete(
  "/delete/:id",
  auth_middlewares.verifyAdmin,
  variantValue_controller.delete
);
router.get("/getAll", variantValue_controller.getAll);
router.get("/getAllSize", variantValue_controller.getAllSize);
router.get("/getAllColor", variantValue_controller.getAllColor);

export default router;
