import { PRIMARY_HERO_FRAGMENT } from "./primary/builder/fragment";
import { PROFILE_FALLBACK_FRAGMENT } from "./profile-fallback/builder/fragment";

export const HERO_FRAGMENT = /* groq */ `
  ${PROFILE_FALLBACK_FRAGMENT},
  ${PRIMARY_HERO_FRAGMENT}
`;
