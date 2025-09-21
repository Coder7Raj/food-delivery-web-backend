import express from "express";
import { upload } from "../middlewares/multer.js";
import { addItem, editItem } from "../controllers/item.controllers.js";
import { isAuth } from "../middlewares/isAuth.js";

const itemRouter = express.Router();

itemRouter.post("/add_item", isAuth, upload.single("image"), addItem);
itemRouter.post("/edit_item/:itemId", isAuth, upload.single("image"), editItem);

export default itemRouter;
