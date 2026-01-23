import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  // Middleware logic for authentication
  try {
    let token;
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    token = req.headers.authorization.split(" ")[1]; // Get token from Bearer token

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token
    req.user = decoded; // Attach decoded user info to request object
    const user = await User.findById(decoded.id); // Fetch full user document
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user; // Attach full user document to request object
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized", error: error.message });
  }
  next();
};

export default authMiddleware;
