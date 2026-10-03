"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { NativeBanner } from "./native-banner";
import { ResponsiveBanner } from "./responsive-banner";

export function FixedAdPortals() {
  const [targets, setTargets] = useState<{ banner: Element; native: Element } | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const banner = document.querySelector("[data-fixed-banner-target]");
      const native = document.querySelector("[data-fixed-native-target]");
      if (banner && native) setTargets({ banner, native });
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!targets) return null;
  return (
    <>
      {createPortal(<ResponsiveBanner />, targets.banner)}
      {createPortal(<NativeBanner />, targets.native)}
    </>
  );
}
