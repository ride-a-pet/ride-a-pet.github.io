"use client";

import { useEffect, useRef } from "react";

const containerId = "container-33a818bf9cce13b55018ef8ecceb580c";
const scriptUrl = "https://pl31582235.profitableratecpmnetwork.com/33a818bf9cce13b55018ef8ecceb580c/invoke.js";

export function NativeBanner() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const timer = window.setTimeout(() => {
      const script = document.createElement("script");
      script.setAttribute("async", "async");
      script.setAttribute("data-cfasync", "false");
      script.src = scriptUrl;
      const container = document.createElement("div");
      container.id = containerId;
      host.append(script, container);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      host.replaceChildren();
    };
  }, []);

  return (
    <div className="ad-placement ad-placement-native" data-native-banner>
      <span className="ad-label">Advertisement</span>
      <div ref={hostRef} />
    </div>
  );
}
