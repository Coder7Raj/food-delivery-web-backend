import express from "express";
import {
  googleAuth,
  resetPassword,
  sendOtp,
  signIn,
  signOut,
  signUp,
  verifyOtp,
} from "../controllers/auth.controllers.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.get("/signout", signOut);
authRouter.post("/send_otp", sendOtp);
authRouter.post("/verify_otp", verifyOtp);
authRouter.post("/reset_password", resetPassword);
authRouter.post("/google_auth", googleAuth);

export default authRouter;
