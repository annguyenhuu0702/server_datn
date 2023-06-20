import { Router } from "express";
import { news_controller } from "../../controllers/news.controller";
import { auth_middlewares } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/getAll", news_controller.getAll);
router.get("/getById/:id", news_controller.getById);
router.get("/getBySlug/:slug", news_controller.getBySlug);
router.post("/create", auth_middlewares.verifyAdmin, news_controller.create);
router.put("/update/:id", auth_middlewares.verifyAdmin, news_controller.update);
router.delete(
  "/delete/:id",
  auth_middlewares.verifyAdmin,
  news_controller.delete
);

export default router;
