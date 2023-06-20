import { Router } from "express";
import { variant_controller } from "../../controllers/variant.controller";
import { auth_middlewares } from "../../middlewares/auth.middleware";

const router = Router();
router.post("/create", auth_middlewares.verifyAdmin, variant_controller.create);
router.get("/getAll", variant_controller.getAll);

export default router;
