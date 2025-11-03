import LogoLoop from "../Components/LogoLoop";
import LazyImage from "../Components/LazyImage";
import { motion } from "framer-motion";
import React, { useEffect, useState, useMemo } from "react";
const PrismLazy = React.lazy(() => import("../Components/Prism"));

const Home = () => {
  const clubLogos = [
    { src: "/img/home1.jpg", alt: "Club 1", href: "#" },
    { src: "/img/home2.webp", alt: "Club 2", href: "#" },
    { src: "/img/home3.webp", alt: "Club 3", href: "#" },
    { src: "/img/home4.webp", alt: "Club 4", href: "#" },
    { src: "/img/home1.jpg", alt: "Club 10", href: "#" },
  ];
  const [showHeroFx, setShowHeroFx] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  // ensure hero FX (Prism) loads when navigating to Home from other routes
  useEffect(() => {
    const onReady = () => setShowHeroFx(true);

    // prefer to defer heavy work to idle to avoid jank on navigation
    let idleHandle = null;
    if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
      idleHandle = window.requestIdleCallback(() => setShowHeroFx(true), { timeout: 500 });
    } else {
      idleHandle = setTimeout(() => setShowHeroFx(true), 300);
    }

    window.addEventListener("appReady", onReady);

    return () => {
      window.removeEventListener("appReady", onReady);
      if (typeof idleHandle === 'number') clearTimeout(idleHandle);
      else if (idleHandle && typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleHandle);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      setPrefersReduced(false);
      return;
    }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setPrefersReduced(!!mq.matches);
    handler();
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else mq.removeListener(handler);
    };
  }, []);

  const prismProps = useMemo(() => {
    // conservative defaults for performance; increase only on capable devices
    const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
    if (prefersReduced) {
      return { reduced: true };
    }
    return {
      animationType: "rotate",
      timeScale: 0.24,
      height: 3.0,
      baseWidth: 5.0,
      scale: dpr > 1.5 ? 3.2 : 2.6,
      hueShift: 0,
      colorFrequency: 2,
      noise: 0,
      glow: 0.45,
      suspendWhenOffscreen: true,
      maxDpr: Math.min(1.0, dpr),
      steps: dpr > 1.5 ? 48 : 36,
      suspendOnScroll: true,
      pulseStrength: 1.35,
    };
  }, [prefersReduced]);

  // Lightweight wrapper: renders motion.div when animations allowed, otherwise plain div.
  const MotionWrapper = ({ animProps, className, children, ...rest }) => {
    if (prefersReduced) {
      return (
        <div className={className} {...rest}>
          {children}
        </div>
      );
    }
    return (
      <motion.div {...animProps} className={className} {...rest}>
        {children}
      </motion.div>
    );
  };

  return (
    <>
      <div className="w-full h-screen bg-black text-white ">
        <React.Suspense fallback={null}>
          {showHeroFx && !prismProps.reduced && (
            <PrismLazy
              animationType={prismProps.animationType}
              timeScale={prismProps.timeScale}
              height={prismProps.height}
              baseWidth={prismProps.baseWidth}
              scale={prismProps.scale}
              hueShift={prismProps.hueShift}
              colorFrequency={prismProps.colorFrequency}
              noise={prismProps.noise}
              glow={prismProps.glow}
              suspendWhenOffscreen={prismProps.suspendWhenOffscreen}
              maxDpr={prismProps.maxDpr}
              steps={prismProps.steps}
              suspendOnScroll={prismProps.suspendOnScroll}
              pulseStrength={prismProps.pulseStrength}
            />
          )}
          {/* static, cheap fallback for users who prefer reduced motion */}
          {showHeroFx && prismProps.reduced && (
            <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/65 to-green-900/10" />
          )}
        </React.Suspense>
        <img
          className="relative w-48 sm:w-64 md:w-80 lg:w-96 scale-100 sm:scale-125 md:scale-150 h-32 sm:h-48 md:h-64  left-1/2 -translate-x-1/2  -top-[50%] -translate-y-1/2 z-20"
          src="/img/pulse-logo.png"
          alt="Pulse Logo"
          width="384"
          height="256"
          decoding="async"
          fetchpriority="high"
          data-preload="critical"
        />
      </div>

      {/* Clubs Section (commented out on request)
      <div className="w-full bg-black text-white py-16 px-4 sm:px-8 md:px-16 relative overflow-hidden border-t border-green-500/20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
            Our Clubs
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Explore the diverse community of clubs that make Pulse vibrant and dynamic
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <LogoLoop
            logos={clubLogos}
            speed={50}
            direction="left"
            logoHeight={96}
            gap={28}
            pauseOnHover
            scaleOnHover={false}
            fadeOut
            fadeOutColor="#000000"
            ariaLabel="Pulse Clubs"
          />
        </motion.div>
      </div>
      */}

      <div className="w-full min-h-screen bg-black text-white py-20 px-4 sm:px-8 md:px-16 relative overflow-hidden" style={{ contentVisibility: 'auto', containIntrinsicSize: '1000px' }}>
        {/* Animated Green Blur Balls Background */}
        {/* reduce or disable heavy background animation when user prefers reduced motion */}
        {prefersReduced ? (
          <div className="absolute bottom-20 right-1/3 w-72 h-72 bg-teal-500/10 rounded-full blur-sm" aria-hidden />
        ) : (
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, -120, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-20 right-1/3 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl will-change-transform"
          />
        )}

        {/* Content with relative positioning to stay above blur balls */}
        <div className="relative z-10">


          {/* Image Section 1 - Left Image, Right Text */}
          <MotionWrapper
            animProps={{ initial: { opacity: 0, x: -100 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.8, delay: 0.2 }, viewport: { once: true, amount: 0.3 } }}
            className="grid md:grid-cols-2 gap-8 items-center mb-20"
          >
             <div className="overflow-hidden rounded-3xl shadow-xl shadow-green-500 border border-green-500/20">
               <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.25 }}>
                 <LazyImage
                   src="/img/home1.jpg"
                 alt="Pulse Club Innovation"
                 className="w-full h-[400px] object-cover"
                   width={1200}
                   height={800}
                   fetchpriority="high"
                   data-preload="critical"
                   eager
               />
               </motion.div>
             </div>
            <MotionWrapper
              animProps={{ initial: { opacity: 0, x: 100 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.8, delay: 0.4 }, viewport: { once: true, amount: 0.3 } }}
              className="space-y-4"
            >
               <h3 className="text-3xl md:text-4xl font-bold text-green-400">
                 Innovation Hub
               </h3>
               <p className="text-gray-300 text-lg leading-relaxed">
                 At Pulse Club, we foster a culture of innovation and creativity. Our members collaborate on cutting-edge projects, pushing the boundaries of technology and design to create solutions that matter.
               </p>
            </MotionWrapper>
          </MotionWrapper>

           {/* Image Section 2 - Right Image, Left Text */}
          <MotionWrapper
            animProps={{ initial: { opacity: 0, x: 100 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.8, delay: 0.2 }, viewport: { once: true, amount: 0.3 } }}
            className="grid md:grid-cols-2 gap-8 items-center mb-20"
          >
             <MotionWrapper
              animProps={{ initial: { opacity: 0, x: -100 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.8, delay: 0.4 }, viewport: { once: true, amount: 0.3 } }}
              className="space-y-4 md:order-1"
            >
               <h3 className="text-3xl md:text-4xl font-bold text-emerald-400">
                 Community Driven
               </h3>
               <p className="text-gray-300 text-lg leading-relaxed">
                 Join a vibrant community of like-minded individuals who share your passion for technology. Network, learn, and grow together through workshops, hackathons, and collaborative projects.
               </p>
            </MotionWrapper>
             <div className="overflow-hidden rounded-lg shadow-2xl shadow-emerald-500/20 border border-emerald-500/20 md:order-2">
               <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.25 }}>
                 <LazyImage
                 src="/img/home2.webp"
                 alt="Pulse Club Community"
                 className="w-full h-[400px] object-cover"
                   width={1200}
                   height={800}
                   fetchpriority="high"
                   data-preload="critical"
               />
               </motion.div>
             </div>
          </MotionWrapper>

           {/* Image Section 3 - Left Image, Right Text */}
          <MotionWrapper
            animProps={{ initial: { opacity: 0, x: -100 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.8, delay: 0.2 }, viewport: { once: true, amount: 0.3 } }}
            className="grid md:grid-cols-2 gap-8 items-center mb-20"
          >
             <div className="overflow-hidden rounded-lg shadow-2xl shadow-lime-500/20 border border-lime-500/20">
               <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.25 }}>
                 <LazyImage
                 src="/img/home3.webp"
                 alt="Pulse Club Learning"
                 className="w-full h-[400px] object-cover"
                   width={1200}
                   height={800}
                   data-preload="critical"
               />
               </motion.div>
             </div>
            <MotionWrapper
              animProps={{ initial: { opacity: 0, x: 100 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.8, delay: 0.4 }, viewport: { once: true, amount: 0.3 } }}
              className="space-y-4"
            >
               <h3 className="text-3xl md:text-4xl font-bold text-lime-400">
                 Learn & Grow
               </h3>
               <p className="text-gray-300 text-lg leading-relaxed">
                 Access exclusive workshops, mentorship programs, and learning resources. Whether you're a beginner or an expert, Pulse Club provides the perfect environment to enhance your skills and knowledge.
               </p>
            </MotionWrapper>
          </MotionWrapper>

           {/* Image Section 4 - Right Image, Left Text */}
          <MotionWrapper
            animProps={{ initial: { opacity: 0, x: 100 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.8, delay: 0.2 }, viewport: { once: true, amount: 0.3 } }}
            className="grid md:grid-cols-2 gap-8 items-center mb-20"
          >
             <MotionWrapper
              animProps={{ initial: { opacity: 0, x: -100 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.8, delay: 0.4 }, viewport: { once: true, amount: 0.3 } }}
              className="space-y-4 md:order-1"
            >
               <h3 className="text-3xl md:text-4xl font-bold text-teal-400">
                 Build Together
               </h3>
               <p className="text-gray-300 text-lg leading-relaxed">
                 Transform your ideas into reality with the support of our talented community. From concept to deployment, Pulse Club provides the resources, guidance, and collaboration you need to succeed.
               </p>
            </MotionWrapper>
             <div className="overflow-hidden rounded-lg shadow-2xl shadow-teal-500/20 border border-teal-500/20 md:order-2">
               <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.25 }}>
                 <LazyImage
                 src="/img/home4.webp"
                 alt="Pulse Club Building"
                 className="w-full h-[400px] object-cover"
                   width={1200}
                   height={800}
                   data-preload="critical"
               />
               </motion.div>
             </div>
          </MotionWrapper>

           {/* Call to Action */}

         </div>
       </div>
     </>

   );
 };
 
 export default Home;
