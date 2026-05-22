import HTTP_STATUS from "../lib/statusCodes.js";

/**
 * Express Global Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error("🚨 Unhandled Application Error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected server error occurred",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
