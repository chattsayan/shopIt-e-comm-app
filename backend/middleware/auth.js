import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Check if user is authenticated
export const isAuthenticatedUser = async (req, res, next) => {
  try {
    // ----- READING COOKIE -----
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login to access this resource!");
    }

    // ----- VALIDATING TOKEN -----
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const { id } = decoded;

    // ----- FETCHING USER -----
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found.");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).send(`Authentication Error: ${error.message}`);
  }
};

// Authorize user roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role: (${
          req.user?.role || "unknown"
        }) is not allowed to access this resource`,
      });
    }

    next();
  };
};
