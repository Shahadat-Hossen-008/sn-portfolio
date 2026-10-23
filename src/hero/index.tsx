import type { IHeroBuilderProps } from "./interface";
import { PrimaryHeroBuilder } from "./primary/builder";
import { ProfileFallbackBuilder } from "./profile-fallback/builder";

export function HeroBuilder({ profile }: IHeroBuilderProps) {
  const hero = profile?.hero;
  // An unpublished or blank hero keeps the original profile block as fallback.
  const showHero = Boolean(hero?.headline?.trim());

  if (showHero && hero) {
    return (
      <PrimaryHeroBuilder hero={hero} fullName={profile?.fullName ?? null} />
    );
  }

  return <ProfileFallbackBuilder profile={profile} />;
}

export default HeroBuilder;
