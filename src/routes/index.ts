import { Router } from "express";
import configRouter from "./v1";

const router = Router();

router.use("/v1", configRouter);

export default router;
