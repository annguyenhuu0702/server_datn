import { Request, Response, Router } from "express";
import { unlink } from "fs";
import { promisify } from "util";
import { getCloudinary } from "../../config/configCloudinary";
import { upload } from "../../middlewares/upload.middleware";

const router = Router();

router.post(
  "/single",
  upload.single("image"),
  async (req: Request, res: Response) => {
    if (req.file) {
      const image = await getCloudinary().v2.uploader.upload(req.file.path, {
        folder: "canifa",
      });
      const unlinkAsync = promisify(unlink);
      const path = __dirname.split("src")[0];
      await unlinkAsync(path + "/" + req.file.path);
      return res.status(201).json({ message: "Success", data: image });
    } else {
      return res.status(500).json({ message: "error" });
    }
  }
);

router.post(
  "/multiple",
  upload.array("images"),
  async (req: Request, res: Response) => {
    try {
      if (req.files) {
        const result = [];
        const unlinkAsync = promisify(unlink);
        const path = __dirname.split("src")[0];
        const files = req.files as Express.Multer.File[];
        const promises = [];
        const promiseImgs = [];
        console.log(files, path);
        for (let i = 0; i < files.length; i++) {
          const filePath = files[i].path;
          result.push({ path: filePath });
          promiseImgs.push(
            getCloudinary().v2.uploader.upload(filePath, {
              folder: "canifa",
            })
          );
          promises.push(unlinkAsync(path + "/" + filePath));
        }
        const resultImgs = await Promise.all(promiseImgs);
        await Promise.all(promises);
        return res.status(201).json({ message: "Success", data: resultImgs });
      }
    } catch (error) {
      console.log(error);
    }
    return res.status(500).json({ message: Error });
  }
);

export default router;
