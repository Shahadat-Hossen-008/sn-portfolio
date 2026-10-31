/** Google Tag Manager container ids are always `GTM-` plus uppercase alphanumerics. */
const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/;

/**
 * Returns the id when it is safe to inject, otherwise `null`.
 *
 * The value is used to build a `<script src>` URL, so anything that is not
 * exactly a GTM container id must not reach the DOM. Studio validation is a UX
 * affordance only — documents can be edited through the API, so the frontend
 * re-checks.
 */
export function getGtmContainerId(
  raw: string | null | undefined,
): string | null {
  const trimmed = raw?.trim();

  return trimmed && GTM_ID_PATTERN.test(trimmed) ? trimmed : null;
}