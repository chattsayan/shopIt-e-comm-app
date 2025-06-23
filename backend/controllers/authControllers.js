import User from "../models/User.js";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendMail.js";
import { getResetPasswordTemplate } from "../utils/emailTemplate.js";
import crypto from "crypto";
import { delete_file, upload_file } from "../utils/cloudinary.js";

// @desc   Register user
// @route  POST /api/v1/register
// @access Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = user.getJWTToken();

    res.status(201).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    console.error("Error registering user: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc   Login user
// @route  POST /api/v1/login
// @access Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
      });
    }

    // Find user in database
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if password is correct
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    sendToken(user, 200, res);
  } catch (error) {
    console.error("Error logging in user: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc   Logout user
// @route  GET /api/v1/logout
// @access Public
export const logoutUser = async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({ message: "Logout successful" });
};

// @desc   Forget Password
// @route  POST /api/v1/password/forgot
// @access Public
export const forgotPassword = async (req, res) => {
  try {
    // Find user in database
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    // Get reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create Password Reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = getResetPasswordTemplate(user?.name, resetUrl);

    try {
      await sendEmail({
        email: user.email,
        subject: "ShopIT Password Recovery",
        message,
      });

      res.status(200).json({ message: `Email sent to: ${user.email}` });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      console.error("Email Sending failed- ", error);
      res.status(500).json({ success: false, message: error?.message });
    }
  } catch (error) {
    console.error("Error sending forgot password email: ", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

// @desc   Reset Password
// @route  POST /api/v1/password/reset/:token
// @access Public
export const resetPassword = async (req, res) => {
  try {
    // Hash the URL Token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password reset token is invalid or has been expired",
      });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password does not match",
      });
    }

    // Set new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
  } catch (error) {
    console.error("Error resetting password: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get current user profile
// @route  GET /api/v1/me
// @access Public
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req?.user?._id);

    res
      .status(200)
      .json({ success: true, message: "Current Profile Fetched", user });
  } catch (error) {
    console.error("Error getting current user profile: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update Password
// @route  PUT /api/v1/password/update
// @access Public
export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req?.user?._id).select("+password");

    // Check the previous user password
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    user.password = req.body.password;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated" });
  } catch (error) {
    console.error("Error updating user password: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Upload user avatar
// @route  PUT /api/v1/me/upload_avatar
// @access Public
export const uploadAvatar = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      console.log("No file uploaded");
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // Upload file to cloudinary
    const avatarResponse = await upload_file(file.buffer, "shopIT/avatars");

    if (!avatarResponse) {
      return res
        .status(500)
        .json({ success: false, message: "Cloudinary upload failed" });
    }

    // Remove previous avatar from cloudinary
    if (req?.user?.avatar?.public_id) {
      await delete_file(req?.user?.avatar?.public_id);
    }

    // Update user's avatar in database
    const user = await User.findByIdAndUpdate(req?.user?._id, {
      avatar: avatarResponse,
    });

    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      user,
    });
  } catch (error) {
    console.error("Error while uploading avatar: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update Profile
// @route  PUT /api/v1/me/update
// @access Public
export const updateProfile = async (req, res) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
      new: true,
    });

    res.status(200).json({ success: true, message: "Profile updated", user });
  } catch (error) {
    console.error("Error updating user profile: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get all users
// @route  GET /api/v1/admin/users
// @access Admin
export const allUsers = async (req, res) => {
  try {
    const users = await User.find();
    res
      .status(200)
      .json({ success: true, message: "Fetched All Users", users });
  } catch (error) {
    console.error("Error while fetching all users: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get user details
// @route  GET /api/v1/admin/users/:id
// @access Admin
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with id: ${req.params.id}`,
      });
    }

    res
      .status(200)
      .json({ success: true, message: "User Detail Fetched", user });
  } catch (error) {
    console.error("Error while fetching user detail: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update User
// @route  PUT /api/v1/admin/users/:id
// @access Admin
export const updateUser = async (req, res) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
    });

    res
      .status(200)
      .json({ success: true, message: "User Profile updated", user });
  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete User
// @route  DELETE /api/v1/admin/users/:id
// @access Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with id: ${req.params.id}`,
      });
    }

    // TODO - remove user avatar from cloudinary

    await user.deleteOne();
    res.status(200).json({ success: true, message: "User Deleted", user });
  } catch (error) {
    console.error("Error while deleting user: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
