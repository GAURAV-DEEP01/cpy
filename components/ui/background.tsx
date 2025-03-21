'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import CodeSnippetCard, { CodeSnippet } from './code-snippet-card';

function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export const Background: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const codeSnippetsLibrary = useMemo(
    () => [
      {
        code: `const sum = (a, b) => a + b;`,
        language: 'javascript',
      },
      {
        code: `SELECT * FROM CUSTOMER`,
        language: 'sql',
      },
      {
        code: `def greet():\n    return "Hello"`,
        language: 'python',
      },
      {
        code: `git push origin main`,
        language: 'bash',
      },
    ],
    []
  );

  const generateSnippets = useCallback(
    (width: number, height: number): CodeSnippet[] => {
      if (width < 768) return [];

      const newSnippets: CodeSnippet[] = [];
      let id = 0;

      const positions = [
        { x: 50, y: 80 },
        { x: width - 300, y: 100 },
        { x: 80, y: height - 200 },
        { x: width - 350, y: height - 250 },
      ];

      positions.forEach((pos, i) => {
        newSnippets.push({
          id: id++,
          ...codeSnippetsLibrary[i % codeSnippetsLibrary.length],
          ...pos,
          rotation: (Math.random() - 0.5) * 4,
          opacity: 0.8,
          scale: 0.9,
        });
      });

      return newSnippets;
    },
    [codeSnippetsLibrary]
  );

  const snippets = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return [];
    return generateSnippets(dimensions.width, dimensions.height);
  }, [dimensions, generateSnippets]);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    const debouncedHandleResize = debounce(handleResize, 100);

    window.addEventListener('resize', debouncedHandleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, []);

  const maxWidth = useMemo(() => (dimensions.width < 768 ? 200 : 280), [dimensions.width]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E17] to-[#111827]" />
      <div className="absolute inset-0 bg-grid-pattern" />
      <div className="absolute inset-0 bg-vignette" />

      {snippets.map((snippet, index) => (
        <CodeSnippetCard key={snippet.id} snippet={snippet} index={index} maxWidth={maxWidth} />
      ))}
    </div>
  );
};

export default Background;
