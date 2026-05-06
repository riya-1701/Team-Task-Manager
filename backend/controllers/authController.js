import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

//signup
export const signup = async (req, res) => {
    console.log("signup api called");
  
    const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { name, email, password, role } = req.body;
  console.log("Signup data:", req.body);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser){
        console.log("user already exists");
      return res.status(400).json({ message: "User already exists" });
}
console.log("creating new user...")

//hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Password hashed");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    console.log("User registered successfully: ", user.email);

    // const token = generateToken(user._id);
    // console.log("token generated successfully")

    res.status(201).json({
      message: "User Registered Successfully",
        // token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    console.log("Signup success")
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// login
export const login = async (req, res) => {
  console.log("login api called");

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  console.log("Login userdata:", req.body);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("user not found");
      return res.status(400).json({
        message: "User not exists",
      });
    }
    console.log("User found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("password incorrect");
      return res.status(400).json({
        message: "Wrong Password",
      });
    }
    console.log("Password matched");

    const token = generateToken(user._id);
    console.log("JWT Token generated")
    res.status(200).json({
      message: "LoggedIn Successfully",
    token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    console.log("Login Success")
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};