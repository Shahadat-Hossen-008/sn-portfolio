import { RadialGradientBackground } from "@/components/background/RadialGradientBackground";
import React from "react";

export default function page() {
  return (
    <div className="h-350">
      <RadialGradientBackground variant="hero" />
      <h1 className="3xl">Hey there</h1>
    </div>
  );
}
