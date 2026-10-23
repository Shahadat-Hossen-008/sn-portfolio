export const PROFILE_FALLBACK_FRAGMENT = /* groq */ `
  "fullName": autherInfo->fullName,
  "headline": autherInfo->description,
  "cvUrl": uploadCV.asset->url
`;
