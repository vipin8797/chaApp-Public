import { HTTP_STATUS } from "./statusCodes.js";

/**
 * Sends a standardized success JSON response.
 * @param {object} res - Express response object.
 * @param {object} data - Payload data to send.
 * @param {string} [message="Success"] - Informational message.
 * @param {number} [statusCode=200] - HTTP Status Code.
 */
export const sendSuccess = (res, data = {}, message = "Success", statusCode = HTTP_STATUS.OK) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

/**
 * Sends a standardized error JSON response.
 * @param {object} res - Express response object.
 * @param {string} message - Error description.
 * @param {number} [statusCode=500] - HTTP Status Code.
 * @param {object} [extra={}] - Additional details.
 */
export const sendError = (res, message = "Error", statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, extra = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...extra,
  });
};
