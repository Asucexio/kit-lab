"use client";

import * as React from "react";
import { LiveProvider, LivePreview as ReactLivePreview, LiveError } from "react-live";

export default function LivePreview({ code, className = "" }) {
  return (
    <LiveProvider code={code} scope={{ React }} noInline>
      <div
        className={`crosshair flex min-h-[200px] items-center justify-center rounded-lg border border-border bg-[#0E1118] bg-grid bg-grid p-8 ${className}`}
      >
        <ReactLivePreview />
      </div>
      <LiveError className="mt-3 whitespace-pre-wrap rounded-md border border-red-500/30 bg-red-500/10 p-3 font-mono text-xs text-red-300" />
    </LiveProvider>
  );
}
