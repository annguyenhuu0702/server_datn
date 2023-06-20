import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";

export const auth_middlewares = {
  loginRequire: (req: Request, res: Response, next: NextFunction): any => {
    const reqHeader = req.headers["authorization"];
    if (reqHeader) {
      const accessToken = reqHeader.split(" ")[1];
      if (accessToken) {
        try {
          const user = jwt.verify(
            accessToken,
            process.env.AT || "super-serect"
          );
          res.locals.user = user;
          return next();
        } catch (error) {
          console.log(error);
        }
      }
    }
    return res.status(401).json({
      message: "Unauthorized",
    });
  },
  verifyAdmin: (req: Request, res: Response, next: NextFunction) => {
    const reqHeader = req.headers["authorization"];
    if (reqHeader) {
      const accessToken = reqHeader.split(" ")[1];
      if (accessToken) {
        try {
          const user: any = jwt.verify(
            accessToken,
            process.env.AT || "super-serect"
          );
          res.locals.user = user;
          if (user.role === "admin") {
            return next();
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return res.status(401).json({
      message: "Unauthorized",
    });
  },
};
