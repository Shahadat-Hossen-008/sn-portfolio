import { PRIMARY_HERO_FRAGMENT } from "./primary/builder/fragment";

export const HERO_FRAGMENT = /* groq */ `
  "fullName": autherInfo->fullName,
  ${PRIMARY_HERO_FRAGMENT}
`;
