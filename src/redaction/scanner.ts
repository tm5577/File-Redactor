import { getPatterns, SensitiveKind } from "./patterns.js";

export type SensitiveMatch = { kind: SensitiveKind; value: string };

export function scanSensitive(text: string): SensitiveMatch[] {
  const { email, ssn, phone } = getPatterns();
  const found: SensitiveMatch[] = [];

  collect(found, "ssn", ssn, text);
  collect(found, "email", email, text);
  collect(found, "phone", phone, text);

  // Deduplicate by kind + exact value
  const seen = new Set<string>();
  const unique: SensitiveMatch[] = [];
  for (const m of found) {
    const key = `${m.kind}::${m.value}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(m);
  }

  // Deterministic order
  const order: Record<SensitiveKind, number> = { ssn: 0, email: 1, phone: 2 };
  unique.sort((a, b) => order[a.kind] - order[b.kind]);

  return unique;
}

function collect(
  out: SensitiveMatch[],
  kind: SensitiveKind,
  re: RegExp,
  text: string
) {
  re.lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    const value = m[1] ?? m[0];

    if (kind === "phone") {
      const digits = value.replace(/\D/g, "");
      if (digits.length < 10) continue;
    }

    out.push({ kind, value });
  }
}
