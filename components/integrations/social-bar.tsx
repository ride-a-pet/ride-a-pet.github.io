"use client";

import { useEffect } from "react";

const src = "https://pl31582236.profitableratecpmnetwork.com/1b/57/cc/1b57cc74e835b8f99a4c692dc1f801ad.js";
let initialized = false;

export function SocialBar() {
  useEffect(() => {
    if (initialized) return;
    const timer = window.setTimeout(() => {
      if (initialized) return;
      initialized = true;
      const script = document.createElement("script");
      script.async = false;
      script.src = src;
      document.body.appendChild(script);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  return null;
}
