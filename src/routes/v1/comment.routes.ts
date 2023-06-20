import { Router } from "express";
import { auth_middlewares } from "../../middlewares/auth.middleware";
import { comment_controller } from "../../controllers/comment.controller";

const router = Router();

router.get("/getAll", auth_middlewares.verifyAdmin, comment_controller.getAll);
router.get("/getByProduct/:productId", comment_controller.getByProduct);

router.post(
  "/create",
  auth_middlewares.loginRequire,
  comment_controller.create
);

router.put(
  "/update/:id",
  auth_middlewares.loginRequire,
  comment_controller.update
);

router.delete(
  "/delete/:id",
  auth_middlewares.loginRequire,
  comment_controller.delete
);

export default router;
