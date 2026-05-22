import jwt from "jsonwebtoken";

/**
 * Generates a JSON Web Token for the specified user ID.
 * @param {string|object} userId - The unique identifier of the user.
 * @returns {string} The signed JWT token.
 * @throws {Error} If the JWT_SECRET is missing or the userId is invalid.
 */
export const generateToken = (userId) => {
  if (!userId) {
    throw new Error("Cannot generate token: User ID is required");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Cannot generate token: JWT_SECRET environment variable is missing");
  }

  try {
    return jwt.sign(
      { userId: userId.toString() },
      secret,
      { expiresIn: "7d" }
    );
  } catch (err) {
    console.error("🚨 Error signing JWT token:", err.message);
    throw err;
  }
};
