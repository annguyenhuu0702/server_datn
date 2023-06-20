import { Router } from "express";
import { payment_controller } from "../../controllers/payment.controller";
import { auth_middlewares } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/getAll", payment_controller.getAll);
router.get("/getAllPaymentItem", payment_controller.getAllPaymentItem);
router.get(
  "/getById/:id",
  auth_middlewares.verifyAdmin,
  payment_controller.getById
);
router.get(
  "/getByUser",
  auth_middlewares.loginRequire,
  payment_controller.getByUser
);
router.post(
  "/create",
  auth_middlewares.loginRequire,
  payment_controller.create
);

router.post("/create-nologin", payment_controller.createNoLogin);

router.put(
  "/update/:id",
  auth_middlewares.loginRequire,
  payment_controller.update
);

router.delete(
  "/delete/:id",
  auth_middlewares.loginRequire,
  payment_controller.delete
);

router.post(
  "/check-point",
  auth_middlewares.loginRequire,
  payment_controller.checkPoint
);

router.get(
  "/revenue-month",
  auth_middlewares.verifyAdmin,
  payment_controller.getRevenueMonth
);

router.get(
  "/revenue-year",
  auth_middlewares.verifyAdmin,
  payment_controller.getRevenueYear
);

router.get("/create_url", payment_controller.create_url);
// router.get("/vnpay_return", payment_controller.vnpay_return);

export default router;
