export interface GradientColor {
  color: string;
  stop: string;
}

export interface GradientConfig {
  position: string;
  size: string;
  colors: GradientColor[];
  blur: string;
  opacity: string;
}

export interface IRadialGradientBackgroundProps {
  variant?: "hero" | "about" | "custom";
  gradients?: GradientConfig[];
}
