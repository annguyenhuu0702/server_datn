import { Router } from "express";
import { product_controller } from "../../controllers/product.controller";
import { auth_middlewares } from "../../middlewares/auth.middleware";

const router = Router();
router.get("/getAllProductName", product_controller.getAllNameProduct);
router.get(
  "/getAllProductCategoryId",
  product_controller.getAllProductCategoryId
);

router.get(
  "/productRecommendationsbyUser",
  auth_middlewares.loginRequire,
  product_controller.productRecommendationsbyUser
);

router.get("/search-product", product_controller.searchProduct);

router.post("/create", auth_middlewares.verifyAdmin, product_controller.create);
router.put(
  "/update/:id",
  auth_middlewares.verifyAdmin,
  product_controller.update
);
router.delete(
  "/delete/:id",
  auth_middlewares.verifyAdmin,
  product_controller.delete
);
router.get("/getAll", product_controller.getAll);
router.get("/getAllAdmin", product_controller.getAllAdmin);
router.get("/getById/:id", product_controller.getById);
router.get("/getBySlug/:slug", product_controller.getBySlug);
router.get("/category/:slug", product_controller.getByCategory);
router.get("/getHomePage", product_controller.getHomePage);
router.get("/getProductStar", product_controller.getProductStar);
router.get("/getProductSale", product_controller.getProductSale);
router.get("/getProductSelling", product_controller.getProductSelling);
router.put("/activeProduct/:id", product_controller.activeProduct);

export default router;
