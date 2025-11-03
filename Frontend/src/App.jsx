import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import NRoutes from "./Routes/NRoutes";
import Footer from "./Components/Footer";
import { useLenis } from "./hooks/useLenis";
import { MotionConfig } from "framer-motion";
import LoadingScreen from "./Components/LoadingScreen";
import PageTransitionLoader from "./Components/PageTransitionLoader";
import GreenDustBackground from "./Components/GreenDustBackground";
// import CustomCursor from "./Components/CustomCursor";
import { waitForCriticalImages } from "./utils/preload";

const App = () => {
  const location = useLocation();
  const [initialLoading, setInitialLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);
  useLenis();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        await waitForCriticalImages(["img[data-preload=critical]"], 8000);
      } finally {
        if (!cancelled) {
          setInitialLoading(false);
          window.dispatchEvent(new Event("appReady"));
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // show a brief loader on route changes
    setRouteLoading(true);
    const t = setTimeout(() => setRouteLoading(false), 1600);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <GreenDustBackground />
      {/* <CustomCursor /> */}
      <LoadingScreen visible={initialLoading} />
      {/* <PageTransitionLoader visible={routeLoading && !initialLoading} /> */}
      <div className="relative bg-black min-h-screen">
        <div className="select-none">
          <Navbar />
          <NRoutes />
          {/* <Footer /> */}
        </div>
      </div>
    </MotionConfig>
  );
};

export default App;
