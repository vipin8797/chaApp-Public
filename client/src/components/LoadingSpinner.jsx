import React from "react";

/**
 * A beautiful, sleek and customizable loading spinner component.
 * Blends perfectly with dark themes.
 */
export const LoadingSpinner = ({ size = "md", color = "emerald" }) => {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  const colorClasses = {
    emerald: "border-emerald-500 border-t-transparent",
    blue: "border-blue-500 border-t-transparent",
    gray: "border-gray-400 border-t-transparent",
  };

  return (
    <div className="flex items-center justify-center min-h-[100px] w-full" aria-live="polite">
      <div
        className={`
          animate-spin 
          rounded-full 
          ${sizeClasses[size] || sizeClasses.md} 
          ${colorClasses[color] || colorClasses.emerald}
        `}
        role="status"
        aria-label="Loading"
      ></div>
    </div>
  );
};

export default LoadingSpinner;
