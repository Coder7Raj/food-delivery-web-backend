import User from "../models/user.model.js";
import { sendOtpEmail } from "../utils/mail.js";
import getToken from "../utils/token.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    if (mobile.length < 11) {
      return res
        .status(400)
        .json({ message: "Mobile number must be at least 11 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      role,
    });
    await user.save();
    const token = await getToken(user._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json(user);
  } catch (error) {
    res.status(500).json(`sign up error: ${error}`);
  }
};

//
export const signIn = async (req, res) => {
  try {
    console.log("SignIn request body:", req.body);
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await getToken(user._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json(user);
  } catch (error) {
    res.status(500).json(`sign in error: ${error}`);
  }
};

//
export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Sign out successful" });
  } catch (error) {
    res.status(500).json(`sign out error: ${error}`);
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
    user.isOtpVerified = false; // Reset OTP verification status
    await user.save();
    await sendOtpEmail(email, otp);
    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    return res.status(500).json(`send otp error: ${error}`);
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    user.isOtpVerified = true; // Mark OTP as verified
    user.resetOtp = undefined; // Clear OTP
    user.otpExpires = undefined; // Clear OTP expiry
    await user.save();
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json(`verify otp error: ${error}`);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "OTP verification required" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false; // Reset OTP verification status
    await user.save();
    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json(`reset password error: ${error}`);
  }
};
