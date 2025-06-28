export default (user, statusCode, res) => {
  // Create JWT Token
  const token = user.getJWTToken();

  // Options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // ----- required portion for making live -----
    // sameSite: "none",
    // secure: true, // only in production
    // ----- required portion for making live -----
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ message: "Login successful", token });
};
