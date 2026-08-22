const NON_BREAKING_SPACE = String.fromCharCode(160);

/**
 * Replaces the last space in a string with a non-breaking space so the
 * final word of a paragraph never wraps onto its own line as a widow.
 */
export function preventOrphan(text: string): string {
  const lastSpace = text.lastIndexOf(" ");
  if (lastSpace === -1) return text;
  return `${text.slice(0, lastSpace)}${NON_BREAKING_SPACE}${text.slice(lastSpace + 1)}`;
}
