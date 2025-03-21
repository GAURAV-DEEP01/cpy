import React from "react";

const features = [
  {
    title: "Lightning Fast",
    description:
      "Generate and share content in seconds with our optimized platform.",
    bgColor: "bg-violet-900/30",
    iconColor: "text-violet-400",
    iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "24 hrs Life-span",
    description: "Your content is available for 24 hours and will be discarded.",
    bgColor: "bg-cyan-900/30",
    iconColor: "text-cyan-400",
    iconPath:
      "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  },
  {
    title: "Multiple Formats",
    description:
      "Share code, links, and images - all with the same simple interface.",
    bgColor: "bg-emerald-900/30",
    iconColor: "text-emerald-400",
    iconPath: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01",
  },
];

export const FeatureCards: React.FC = () => {
  return (
    <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {features.map(
        ({ title, description, bgColor, iconColor, iconPath }, index) => (
          <div
            key={title}
            className={`rounded-lg bg-gray-800/90 p-6 transition-all hover:bg-gray-800 ${index === 2 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
          >
            <div
              className={`mb-4 rounded-full ${bgColor} p-3 w-12 h-12 flex items-center justify-center`}
            >
              <svg
                className={`h-6 w-6 ${iconColor}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={iconPath}
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium">{title}</h3>
            <p className="mt-2 text-gray-400">{description}</p>
          </div>
        )
      )}
    </div>
  );
};
