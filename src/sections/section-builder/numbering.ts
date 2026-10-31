const FIRST_NUMBERED_SECTION = 2;

/**
 * Numbers renderable sections from 02 after the hero; skipped sections do not
 * consume a number.
 */
export function assignSectionNumbers(
  rendered: boolean[],
  start: number = FIRST_NUMBERED_SECTION,
): Array<number | null> {
  let next = start;
  return rendered.map((isRendered) => (isRendered ? next++ : null));
}
