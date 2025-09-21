import express from "express";
import { createEditShop } from "../controllers/shop.controllers";
import { isAuth } from "../middlewares/isAuth";

const shopRouter = express.Router();

shopRouter.get("/create_edit", isAuth, createEditShop);

export default shopRouter;
