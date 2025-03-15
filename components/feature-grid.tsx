'use client'

export function FeatureGrid({ children }: any) {
  return (
    <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}
