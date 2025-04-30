
import React from "react";
import { Progress } from "@/components/ui/progress";

const CompatibilityScore = ({ score, size = "medium", showDetails = false, matchFactors = null }) => {
  // Define color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  // Define size classes
  const sizeClasses = {
    small: "h-20 w-20 text-sm",
    medium: "h-32 w-32 text-base",
    large: "h-40 w-40 text-lg",
  };

  // Match factor descriptions
  const factorDescriptions = {
    lifestyle: "Your lifestyles align well",
    cleanliness: "Similar cleanliness preferences",
    schedule: "Compatible schedules",
    interests: "Shared interests",
    habits: "Compatible habits",
  };

  return (
    <div className={`flex ${showDetails ? "flex-col items-center" : ""}`}>
      <div className={`relative rounded-full ${sizeClasses[size]} flex items-center justify-center ${getScoreColor(score)} text-white font-bold border-4 border-background shadow-md`}>
        <span className="absolute">
          <span className="text-2xl md:text-3xl">{score}%</span>
          <span className="block text-xs opacity-90 mt-1">Match</span>
        </span>
      </div>

      {showDetails && matchFactors && (
        <div className="mt-6 w-full max-w-md">
          <h4 className="font-medium mb-4 text-center">What makes you compatible</h4>
          <div className="space-y-4">
            {Object.entries(matchFactors).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{factorDescriptions[key] || key}</span>
                  <span className="font-medium">{value}%</span>
                </div>
                <Progress value={value} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompatibilityScore;
