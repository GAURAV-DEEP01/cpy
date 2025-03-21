'use client';
import React, { memo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then((mod) => mod.Prism),
  {
    ssr: false,
    loading: () => null,
  }
);

export interface CodeSnippet {
  id: number;
  code: string;
  language: string;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
  scale: number;
}

interface CodeSnippetCardProps {
  snippet: CodeSnippet;
  index: number;
  maxWidth: number;
}

const cardVariants: Variants = {
  hidden: (custom: { index: number; rotation: number; scale: number }) => ({
    x: custom.index % 2 === 0 ? '-30vw' : '30vw',
    opacity: 0,
    rotate: custom.rotation,
    scale: custom.scale,
  }),
  visible: (custom: { index: number; rotation: number; scale: number }) => ({
    x: 0,
    opacity: 1,
    rotate: custom.rotation,
    scale: custom.scale,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      delay: custom.index * 0.3,
    },
  }),
};

const HighlighterWithLoadTracking = ({ code, language, onLoaded }: { code: string, language: string, onLoaded: any }) => {
  const [_isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    onLoaded();
  }, [onLoaded]);

  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      codeTagProps={{
        style: {
          fontFamily: 'inherit',
          fontSize: 'inherit',
        },
      }}
      customStyle={{
        margin: 0,
        padding: '0.75rem 1rem',
        backgroundColor: 'transparent',
      }}
      wrapLines
      wrapLongLines
    >
      {code}
    </SyntaxHighlighter>
  );
};

const CodeSnippetCard: React.FC<CodeSnippetCardProps> = memo(
  ({ snippet, index, maxWidth }) => {
    const [isContentLoaded, setIsContentLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const handleContentLoaded = () => {
      setIsContentLoaded(true);
      setTimeout(() => setIsVisible(true), 0);
    };

    return (
      <AnimatePresence>
        <motion.div
          className="absolute overflow-hidden rounded-md backdrop-blur-sm code-snippet"
          style={{
            left: snippet.x,
            top: snippet.y,
            maxWidth: maxWidth,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(15, 23, 42, 0.8)',
            opacity: isContentLoaded ? 1 : 0, // Hide until content is loaded
          }}
          variants={cardVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          custom={{ index, rotation: snippet.rotation, scale: snippet.scale }}
        >
          <div className="text-xs opacity-90 px-3 py-1.5 border-b border-gray-700 bg-gray-800/90 flex items-center">
            <div className="flex space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
            <span className="ml-2 text-gray-300 text-xs font-mono">
              {snippet.language}
            </span>
          </div>
          <div className="code-content-container">
            <HighlighterWithLoadTracking
              code={snippet.code}
              language={snippet.language}
              onLoaded={handleContentLoaded}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }
);

CodeSnippetCard.displayName = 'CodeSnippetCard';
export default CodeSnippetCard;
