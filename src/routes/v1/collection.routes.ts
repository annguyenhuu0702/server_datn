import { Router } from "express";
import { collection_controller } from "../../controllers/collection.controller";
import { auth_middlewares } from "../../middlewares/auth.middleware";

const router = Router();
router.post(
  "/create",
  auth_middlewares.verifyAdmin,
  collection_controller.create
);
router.put(
  "/update/:id",
  auth_middlewares.verifyAdmin,
  collection_controller.update
);
router.delete(
  "/delete/:id",
  auth_middlewares.verifyAdmin,
  collection_controller.delete
);
router.get("/getAll", collection_controller.getAll);
router.get("/getById/:id", collection_controller.getById);

export default router;
