'use client'

export function PageFooter({ year = "2025", domain = "deeeep.fun" }) {
  return (
    <footer className="mt-20 border-t border-gray-800 py-8">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        <p className="text-white">© {year} {domain} All rights reserved.</p>
      </div>
    </footer>
  );
}
