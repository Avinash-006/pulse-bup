import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ visible = true }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      setIsExiting(false);
    } else {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 1600); 
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 bg-black z-[9999] flex items-center justify-center transition-opacity duration-[1600ms] ease-in-out ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      {/* Centered video used as preload animation (looped, muted, autoplay) */}
      <video
        src="/video/IMG_3862.MP4"
        aria-label="Loading animation"
        className="max-w-[30vw] max-h-[39vh] w-auto h-auto object-contain rounded-md shadow-2xl"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
    </div>
  );
};

export default LoadingScreen;