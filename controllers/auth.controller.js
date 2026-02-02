import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Implementation for sign-up logic
    const { name, email, password } = req.body;

    // check if user already exists
    const checkUserExists = await User.findOne({ email });

    if (checkUserExists) {
      const error = new Error("User already exists with this email");
      error.status = 409;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create(
      [{ name, email, password: hashedPassword }],
      { session },
    );

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Send A JSON response with a status code of 201 (Created)
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: newUser,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

const signIn = async (req, res, next) => {
  
  // We only need email and password from the request body.
  const { email, password } = req.body;

  try {
    // Find user by email
    const findUser = await User.findOne({ email });
    if (!findUser) {
      // if not found then throw error
      const error = new Error("Provided email is invalid");
      error.status = 401;
      throw error;
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      // if not match then throw error
      const error = new Error("Provided password is invalid");
      error.status = 401;
      throw error;
    }

    // Generate JWT token
    const token = jwt.sign({ id: findUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    
    // Send A JSON response with a status code of 200 (OK)
    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        token,
        user: findUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

const signOut = async (req, res, next) => {
  try {
    // Implementation for sign-out logic
    res.status(200).json({
      success: true,
      message: "User signed out successfully",
    });
  } catch (error) {
    next(error);
  }
};



export { signUp, signIn, signOut };

