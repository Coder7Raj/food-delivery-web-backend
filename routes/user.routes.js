import express from "express";
import { getCurentUser } from "../controllers/user.controllers.js";
import { isAuth } from "../middlewares/isAuth.js";

const userRouter = express.Router();

userRouter.get("/current_user", isAuth, getCurentUser);

export default userRouter;
