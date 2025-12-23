export type SensitiveKind = "email" | "phone" | "ssn";

export function getPatterns() {
  const email =
    /(?<![A-Z0-9._%+-])([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})(?![A-Z0-9._%+-])/gi;

  const ssn = /\b(?!000|666|9\d\d)\d{3}-(?!00)\d{2}-(?!0000)\d{4}\b/g;

  const phone =
    /\b(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/g;

  return { email, ssn, phone };
}

export function markerFor(kind: SensitiveKind): string {
  switch (kind) {
    case "email":
      return "[REDACTED:EMAIL]";
    case "phone":
      return "[REDACTED:PHONE]";
    case "ssn":
      return "[REDACTED:SSN]";
  }
}
