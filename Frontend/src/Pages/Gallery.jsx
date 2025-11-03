import React, { useEffect, useState } from "react";
import DomeGallery from "../Components/DomeGallery";

const Gallery = () => {
  const [settings, setSettings] = useState({ segments: 32, minRadius: 1200, padFactor: 0.22 });

  useEffect(() => {
    const compute = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 1280;
      const isSmall = w < 640;
      const isMedium = w < 1024;
      setSettings({
        segments: isSmall ? 22 : isMedium ? 28 : 32,
        minRadius: isSmall ? 800 : isMedium ? 1000 : 1200,
        padFactor: isSmall ? 0.18 : 0.22,
      });
    };
    compute();
    window.addEventListener("resize", compute, { passive: true });
    return () => window.removeEventListener("resize", compute);
  }, []);

  return (
    <div className="w-full h-screen bg-black text-white">
      <DomeGallery
        segments={settings.segments}
        minRadius={settings.minRadius}
        padFactor={settings.padFactor}
        enableBlur={true}
      />
    </div>
  );
};

export default Gallery;
