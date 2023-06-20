import { Router } from "express";
import { admin_controller } from "../../controllers/admin.controller";
import { auth_middlewares } from "../../middlewares/auth.middleware";

const router = Router();

router.get(
  "/getHomeAdmin",
  auth_middlewares.verifyAdmin,
  admin_controller.getHomeAdmin
);

export default router;
