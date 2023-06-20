import { Router } from "express";
import { user_controller } from "../../controllers/user.controller";
import { auth_middlewares } from "../../middlewares/auth.middleware";

const router = Router();

router.put(
  "/updateSuggestion/:id",
  auth_middlewares.loginRequire,
  user_controller.updateSuggestion
);

router.post("/create", auth_middlewares.verifyAdmin, user_controller.create);
router.put("/update/:id", auth_middlewares.verifyAdmin, user_controller.update);
router.delete(
  "/delete/:id",
  auth_middlewares.verifyAdmin,
  user_controller.delete
);
router.get(
  "/getById/:id",
  auth_middlewares.verifyAdmin,
  user_controller.getById
);
router.get("/getAll", auth_middlewares.verifyAdmin, user_controller.getAll);

export default router;
