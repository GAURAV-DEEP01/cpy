'use client'
import { useEffect } from 'react';

function Background() {
  useEffect(() => {
    const ripple: HTMLDivElement | null = document.querySelector('.ripple');
    const moveRipple = (e: any) => {
      ripple!.style.left = `${e.clientX}px`;
      ripple!.style.top = `${e.clientY}px`;
    };

    document.addEventListener('mousemove', moveRipple);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mousemove', moveRipple);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Grid Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(1, 10, 10, 1)', // Matches bg-gray-900
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px', // Adjust grid size as needed
        }}
      />
      {/* Ripple Effect */}
      <div className="ripple fixed" />
    </div>
  );
}

export default Background;
