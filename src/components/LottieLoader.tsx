"use client";

import React from "react";
import { DotLottieReact, setWasmUrl } from "@lottiefiles/dotlottie-react";

setWasmUrl("/dotlottie-player.wasm");

export function LottieLoader({ src = "/search.lottie" }: { src?: string }) {
  return <DotLottieReact src={src} loop autoplay className="w-full h-full" />;
}
