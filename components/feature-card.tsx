'use client'

export function FeatureCard({ icon, title, description, bgColorClass = "bg-gray-800/80" }: any) {
  return (
    <div className={`rounded-lg ${bgColorClass} p-6 transition-all hover:bg-gray-800`}>
      <div className="mb-4 rounded-full bg-violet-900/30 p-3 w-12 h-12 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="mt-2 text-gray-400">{description}</p>
    </div>
  );
}
