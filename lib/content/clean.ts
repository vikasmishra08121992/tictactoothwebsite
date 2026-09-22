/**
 * Strips review markers from content before it renders.
 *
 * Every unconfirmed fact in the content modules is wrapped in a bracketed
 * marker — [PLACEHOLDER: …], [CONFIRM: …], [CLINICAL REVIEW REQUIRED],
 * [LEGAL REVIEW REQUIRED]. That convention is load-bearing: it is how the
 * site refuses to invent facts, and `npm run content` reads the markers
 * straight from the source files to produce the outstanding-items list.
 *
 * For a long time the markers also rendered, in square brackets, in the
 * middle of paragraphs. That made the site look like a generated draft rather
 * than a finished page, and it put internal review notes in front of parents.
 * The two jobs have now been separated: the source keeps the markers so the
 * audit stays honest, and every content module runs its export through this
 * before anything sees it.
 *
 * A string that was *entirely* a marker becomes empty. Components treat empty
 * as absent — a credential that is not known is not shown, rather than shown
 * as a bracketed note — so the page simply says less until the fact arrives.
 */

const MARKER =
  /\s*\[(?:PLACEHOLDER|CONFIRM|CLINICAL REVIEW REQUIRED|LEGAL REVIEW REQUIRED|REAL GOOGLE REVIEWS TO BE SUPPLIED)[^\]]*\]\s*/g;

export function cleanText(value: string): string {
  return value
    .replace(MARKER, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .trim();
}

/** True when a string is nothing but a marker — i.e. the fact is not known. */
export function isUnknown(value: string): boolean {
  return cleanText(value) === "";
}

/**
 * Deep-cleans any content structure: strings are stripped, arrays and plain
 * objects are walked, everything else passes through untouched.
 */
export function cleanContent<T>(value: T): T {
  if (typeof value === "string") return cleanText(value) as T;
  if (Array.isArray(value)) return value.map(cleanContent) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = cleanContent(v);
    }
    return out as T;
  }
  return value;
}
