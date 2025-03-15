'use client';

import React, { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then((mod) => mod.Prism),
  {
    ssr: false,
    loading: () => null,
  }
);

interface CodeSnippet {
  id: number;
  code: string;
  language: string;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
  scale: number;
}

export const Background: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const codeSnippetsLibrary = useMemo(() => [
    {
      code: `const sum = (a, b) => a + b;`,
      language: 'javascript'
    },
    {
      code: `SELECT * FROM CUSTOMER`,
      language: 'sql'
    },
    {
      code: `def greet():\n    return "Hello"`,
      language: 'python'
    },
    {
      code: `git push origin main`,
      language: 'bash'
    },
  ], []);

  const generateSnippets = useCallback((width: number, height: number) => {
    // Do not generate any code snippets on mobile devices
    if (width < 768) return [];

    const newSnippets: CodeSnippet[] = [];
    let id = 0;

    const positions = [
      { x: 50, y: 80 },
      { x: width - 300, y: 100 },
      { x: 80, y: height - 200 },
      { x: width - 350, y: height - 250 }
    ];

    positions.forEach((pos, i) => {
      newSnippets.push({
        id: id++,
        ...codeSnippetsLibrary[i % codeSnippetsLibrary.length],
        ...pos,
        rotation: (Math.random() - 0.5) * 4,
        opacity: 0.8,
        scale: 0.9
      });
    });

    return newSnippets;
  }, [codeSnippetsLibrary]);

  const snippets = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return [];
    return generateSnippets(dimensions.width, dimensions.height);
  }, [dimensions, generateSnippets]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    handleResize();
    resizeObserver.observe(document.body);
    return () => resizeObserver.unobserve(document.body);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E17] to-[#111827]" />
      <div className="absolute inset-0 bg-grid-pattern" />
      <div className="absolute inset-0 bg-vignette" />

      {snippets.map((snippet, index) => (
        <Suspense fallback={null} key={snippet.id}>
          <motion.div
            className="absolute overflow-hidden rounded-md backdrop-blur-sm code-snippet"
            style={{
              left: snippet.x,
              top: snippet.y,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              maxWidth: dimensions.width < 768 ? '200px' : '280px',
              background: 'rgba(15, 23, 42, 0.8)',
            }}
            initial={{ x: index % 2 === 0 ? '-30vw' : '30vw', opacity: 0, rotate: snippet.rotation, scale: snippet.scale }}
            animate={{ x: 0, opacity: 1, rotate: snippet.rotation, scale: snippet.scale }}
            transition={{ duration: 1, delay: index * 0.3 }}
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
              <SyntaxHighlighter
                language={snippet.language}
                style={vscDarkPlus}
                codeTagProps={{
                  style: {
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                  }
                }}
                customStyle={{
                  margin: 0,
                  padding: '0.75rem 1rem',
                  backgroundColor: 'transparent',
                }}
                wrapLines={true}
                wrapLongLines={true}
              >
                {snippet.code}
              </SyntaxHighlighter>
            </div>
          </motion.div>
        </Suspense>
      ))}
    </div>
  );
};

