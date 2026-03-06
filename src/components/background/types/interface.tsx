export interface GradientConfig {
  position: string;
  size: string;
  colors: GradientColor[];
  blur: string;
  opacity: string;
}

export interface RadialGradientBackgroundProps {
  variant?: "hero" | "custom";
  gradients?: GradientConfig[];
}

export interface GradientColor {
  color: string;
  stop: string;
}
