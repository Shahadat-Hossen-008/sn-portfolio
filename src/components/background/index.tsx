import type {
  GradientColor,
  IRadialGradientBackgroundProps,
} from "./interface";

export const RadialGradientBackground = ({
  variant = "hero",
  gradients = [],
}: IRadialGradientBackgroundProps) => {
  const variants = {
    hero: [
      {
        position: "top-1 left-1 -translate-x-1/2 -translate-y-1/2",
        size: "w-[1400px] h-[1400px]",
        colors: [
          { color: "color-mix(in srgb, var(--color-forest) 4%, transparent)", stop: "100%" },
          { color: "color-mix(in srgb, var(--color-forest) 8%, transparent)", stop: "100%" },
          { color: "color-mix(in srgb, var(--color-forest) 10%, transparent)", stop: "100%" },
          { color: "color-mix(in srgb, var(--color-forest) 8%, transparent)", stop: "100%" },
          { color: "color-mix(in srgb, var(--color-forest) 4%, transparent)", stop: "100%" },
        ],
        blur: "0px",
        opacity: "0.5",
      },
      {
        position: "top-1 left-1",
        size: "w-[1400px] h-[1400px]",
        colors: [
          { color: "color-mix(in srgb, var(--color-forest) 4%, transparent)", stop: "100%" },
          { color: "color-mix(in srgb, var(--color-forest) 8%, transparent)", stop: "100%" },
          { color: "color-mix(in srgb, var(--color-forest) 10%, transparent)", stop: "100%" },
          { color: "color-mix(in srgb, var(--color-forest) 8%, transparent)", stop: "100%" },
          { color: "color-mix(in srgb, var(--color-forest) 4%, transparent)", stop: "100%" },
        ],
        blur: "0px",
        opacity: "0.5",
      },
      {
        position: "bottom-1 right-1",
        size: "w-[1400px] h-[1400px]",
        colors: [
          { color: "color-mix(in srgb, var(--color-forest) 4%, transparent)", stop: "100%" },
          { color: "color-mix(in srgb, var(--color-forest) 8%, transparent)", stop: "100%" },
          { color: "color-mix(in srgb, var(--color-forest) 10%, transparent)", stop: "100%" },
          { color: "color-mix(in srgb, var(--color-forest) 8%, transparent)", stop: "100%" },
          { color: "color-mix(in srgb, var(--color-forest) 4%, transparent)", stop: "100%" },
        ],
        blur: "0px",
        opacity: "0.5",
      },
    ],
    about: [
      {
        position: "bottom-0 left-[75%]",
        size: "w-[700px] h-[700px]",
        colors: [
          { color: "color-mix(in srgb, var(--color-forest) 4%, transparent)", stop: "100%" },
          { color: "color-mix(in srgb, var(--color-forest) 8%, transparent)", stop: "100%" },
          { color: "color-mix(in srgb, var(--color-forest) 10%, transparent)", stop: "100%" },
          { color: "color-mix(in srgb, var(--color-forest) 8%, transparent)", stop: "100%" },
          { color: "color-mix(in srgb, var(--color-forest) 4%, transparent)", stop: "100%" },
        ],
        blur: "0px",
        opacity: "0.5",
      },
    ],
  };

  const activeGradients =
    variant === "custom" ? gradients : variants[variant] || variants.hero;
  const generateGradient = (colors: GradientColor[]) => {
    const colorStops = colors
      .map(({ color, stop }) => `${color} ${stop}`)
      .join(", ");
    return `radial-gradient(circle at center, transparent 0%, transparent 30%, ${colorStops}, transparent 60%, transparent 100%)`;
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {activeGradients.map((gradient, index) => (
        <div
          key={index}
          className={`absolute ${gradient.position} ${gradient.size} rounded-full`}
          style={{
            background: generateGradient(gradient.colors),
            filter: `blur(${gradient.blur})`,
            opacity: gradient.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default RadialGradientBackground;
