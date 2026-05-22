/**
 * Verifies that all required environment variables are present on startup.
 */
export const verifyEnv = () => {
  const requiredEnvVars = [
    "MONGODB_URI",
    "JWT_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  const missing = [];

  for (const key of requiredEnvVars) {
    if (!process.env[key] || process.env[key].trim() === "") {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error("==================================================");
    console.error("🚨 CRITICAL ERRORS: Missing Environment Variables");
    console.error("==================================================");
    for (const key of missing) {
      console.error(`- Missing key: ${key}`);
    }
    console.error("==================================================");
    console.warn("⚠️ Warning: Application might fail to run correctly.");
  } else {
    console.log("✅ Environment Variables Verification: SUCCESS");
  }
};
