import { cleanTools } from "@/sections/shared/section-formatting";
import { ProcessSection } from "../index";
import type { IProcessProps, IProcessStep } from "../interface";
import type { ISanityProcessProps } from "./interface";

export function ProcessSectionBuilder({ data }: ISanityProcessProps) {
  const heading = data?.heading?.trim();
  if (!heading) return null;

  const rawSteps = data.steps ?? [];
  const steps: IProcessStep[] = rawSteps
    .filter((step): step is NonNullable<typeof step> => Boolean(step && step.heading?.trim()))
    .slice(0, 5)
    .map((step) => ({
      _key: step._key,
      label: step.label ?? "",
      heading: step.heading.trim(),
      tools: cleanTools(step.tools),
    }));

  const props: IProcessProps = {
    eyebrow: data.eyebrow?.trim() || undefined,
    heading,
    headingAccent: data.headingAccent,
    intro: data.intro?.trim() || undefined,
    steps,
  };

  return <ProcessSection {...props} />;
}

export default ProcessSectionBuilder;
