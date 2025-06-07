import User from "../models/User.js";

// @desc   register user
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

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error registering user: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
