import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import routes from "./routes";
import { prod } from "./constants";

const app = express();

// app.use(
//   cors({
//     origin: prod ? process.env.CORS_ORIGIN_PROD : process.env.CORS_ORIGIN_DEV,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//   })
// );
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

export default app;
