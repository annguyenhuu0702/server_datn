import { Router } from "express";
import { coupon_controller } from "../../controllers/coupon.controller";
import { auth_middlewares } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/getAll", coupon_controller.getAll);
router.get(
  "/getCouponByUser",
  auth_middlewares.loginRequire,
  coupon_controller.getCouponByUser
);
router.post(
  "/check-coupon",
  auth_middlewares.loginRequire,
  coupon_controller.chẹckCoupon
);
router.post("/create", coupon_controller.create);

export default router;
