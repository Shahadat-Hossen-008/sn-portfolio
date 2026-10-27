import type { IHeroBuilderProps } from "./interface";
import { PrimaryHeroBuilder } from "./primary/builder";

export function HeroBuilder({ profile }: IHeroBuilderProps) {
  const hero = profile?.hero;
  const showHero = Boolean(hero?.headline?.trim());

  if (!showHero || !hero) return null;

  return (
    <PrimaryHeroBuilder hero={hero} fullName={profile?.fullName ?? null} />
  );
}

export default HeroBuilder;
