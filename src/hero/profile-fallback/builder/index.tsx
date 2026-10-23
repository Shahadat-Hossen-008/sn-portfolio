import { ProfileFallback } from "../index";
import type { IProfileFallbackProps } from "../interface";
import type { ISanityProfileFallbackProps } from "./interface";

export function ProfileFallbackBuilder({ profile }: ISanityProfileFallbackProps) {
  // If profile data is not available, return null to avoid rendering the component
  if (!profile) return null;

  const props: IProfileFallbackProps = {
    fullName: profile.fullName,
    headline: profile.headline,
    cvUrl: profile.cvUrl,
  };

  return <ProfileFallback {...props} />;
}

export default ProfileFallbackBuilder;
