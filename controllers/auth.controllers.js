import User from "../models/user.model.js";
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
