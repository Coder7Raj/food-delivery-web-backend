import express from "express";
import { createEditShop, getMyShop } from "../controllers/shop.controllers.js";
import { isAuth } from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

const shopRouter = express.Router();

shopRouter.post("/create_edit", isAuth, upload.single("image"), createEditShop);
shopRouter.get("/getmy_shop", isAuth, getMyShop);

export default shopRouter;
