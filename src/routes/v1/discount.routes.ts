import { Router } from "express";
import { discount_controller } from "../../controllers/discount.controller";
import { auth_middlewares } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/create",
  auth_middlewares.verifyAdmin,
  discount_controller.create
);
router.get("/getAll", auth_middlewares.verifyAdmin, discount_controller.getAll);
router.delete(
  "/delete/:id",
  auth_middlewares.verifyAdmin,
  discount_controller.delete
);

export default router;
