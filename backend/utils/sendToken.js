export default (user, statusCode, res) => {
  // Create JWT Token
  const token = user.getJWTToken();

  // Options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax",
    secure: process.env.NODE_ENV === "PRODUCTION", // only in production
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ message: "Login successful", token });
};
