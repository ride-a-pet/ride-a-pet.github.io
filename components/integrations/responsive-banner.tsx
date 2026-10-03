"use client";

import { useEffect, useRef } from "react";

const desktop = {
  options: `  atOptions = {
    'key' : 'a0957c0bd27e081dca502da3c7582d67',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };`,
  src: "https://www.highrevenueformat.com/a0957c0bd27e081dca502da3c7582d67/invoke.js",
  width: 728,
  height: 90,
} as const;

const mobile = {
  options: `  atOptions = {
    'key' : '98e5edc8b2c590b338725dd284c00ce2',
    'format' : 'iframe',
    'height' : 50,
    'width' : 320,
    'params' : {}
  };`,
  src: "https://www.highrevenueformat.com/98e5edc8b2c590b338725dd284c00ce2/invoke.js",
  width: 320,
  height: 50,
} as const;

export function ResponsiveBanner() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // Choose once per mount. Resizing never executes a second ad on this visit.
    const ad = window.matchMedia("(max-width: 767px)").matches ? mobile : desktop;
    host.style.minHeight = `${ad.height}px`;
    host.style.width = `${ad.width}px`;
    const timer = window.setTimeout(() => {
      const options = document.createElement("script");
      options.textContent = ad.options;
      const invoke = document.createElement("script");
      invoke.src = ad.src;
      host.append(options, invoke);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      host.replaceChildren();
    };
  }, []);

  return (
    <div className="ad-placement ad-placement-banner" data-responsive-banner>
      <span className="ad-label">Advertisement</span>
      <div ref={hostRef} className="ad-banner-host" />
    </div>
  );
}
