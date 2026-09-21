// Tiny inline markup for headlines kept in YAML: *word* marks emphasis, and
// line breaks in the text are line breaks on the page.

export interface EmphasisSegment {
  text: string;
  em: boolean;
}

/** Split text into lines, and each line into plain/emphasized segments. */
export function parseEmphasis(text: string): EmphasisSegment[][] {
  return text.split('\n').map((line) =>
    line
      .split(/(\*[^*]+\*)/)
      .filter(Boolean)
      .map((part) => (part.startsWith('*') && part.endsWith('*') ? { text: part.slice(1, -1), em: true } : { text: part, em: false })),
  );
}

/** The same text with the markup removed, for labels and metadata. */
export const stripEmphasis = (text: string): string => text.replace(/\*/g, '').replace(/\n/g, ' ');
