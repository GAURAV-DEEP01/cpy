import React from "react";
import { TwitterIcon, GithubIcon, LinkedinIcon } from "lucide-react"; // Use updated names

export const Footer: React.FC = () => {
  return (
    <footer className="mt-10 border-t border-gray-800 py-6 pt-10 text-gray-300">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm">
        {/* Branding */}
        <p className="mb-4 md:mb-0">&copy; 2025 deeeep.fun. All rights reserved.</p>

        {/* Social Links */}
        <div className="flex space-x-4">
          <a href="https://linkedin.com/in/gaurav-deep01" className="hover:text-white transition"><LinkedinIcon size={18} /></a>
          <a href="https://x.com/_Gaurav_Deep_" className="hover:text-white transition"><TwitterIcon size={18} /></a>
          <a href="https://github.com/GAURAV-DEEP01" className="hover:text-white transition"><GithubIcon size={18} /></a>
        </div>
      </div>
    </footer>
  );
};
