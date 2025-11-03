import React, { useEffect, useRef, useState } from "react";

let inFlight = 0;
const MAX_CONCURRENT_DECODE = 2;
const queue = [];

const runNext = () => {
  if (inFlight >= MAX_CONCURRENT_DECODE) return;
  const next = queue.shift();
  if (!next) return;
  inFlight += 1;
  next()
    .catch(() => {})
    .finally(() => {
      inFlight -= 1;
      runNext();
    });
};

const LazyImage = ({
  src,
  alt = "",
  className,
  width,
  height,
  decoding = "async",
  fetchpriority,
  style,
  eager = false,
}) => {
  const imgRef = useRef(null);
  const [resolvedSrc, setResolvedSrc] = useState(null);

  useEffect(() => {
    let io;
    let isCancelled = false;

    const reveal = async () => {
      try {
        const preload = new Image();
        if (width) preload.width = width;
        if (height) preload.height = height;
        preload.src = src;
        if (preload.decode) await preload.decode();
      } catch (_) {
        // ignore decode errors; we'll still set the src
      } finally {
        if (!isCancelled) setResolvedSrc(src);
      }
    };

    const scheduleReveal = () => {
      return new Promise((resolve) => {
        const task = () => reveal().then(resolve);
        if (inFlight < MAX_CONCURRENT_DECODE) {
          inFlight += 1;
          task()
            .catch(() => {})
            .finally(() => {
              inFlight -= 1;
              runNext();
            });
        } else {
          queue.push(task);
        }
      });
    };

    if (eager) {
      scheduleReveal();
    } else if ('IntersectionObserver' in window && imgRef.current) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            scheduleReveal();
            if (io) io.disconnect();
          }
        },
        { root: null, rootMargin: '1600px 0px', threshold: 0.01 }
      );
      io.observe(imgRef.current);
    } else {
      // Fallback: load immediately
      scheduleReveal();
    }

    return () => {
      isCancelled = true;
      if (io) io.disconnect();
    };
  }, [src, width, height, eager]);

  return (
    <img
      ref={imgRef}
      src={resolvedSrc || undefined}
      alt={alt}
      className={className}
      width={width}
      height={height}
      decoding={decoding}
      fetchpriority={fetchpriority}
      style={{ willChange: 'transform', ...style }}
    />
  );
};

export default LazyImage;


