import { markerFor, SensitiveKind } from "./patterns.js";
import { SensitiveMatch } from "./scanner.js";

export type RedactionCounts = Record<SensitiveKind, number>;

export async function redactBodyWithMatches(
  context: Word.RequestContext,
  matches: SensitiveMatch[],
  report: (msg: string) => void
): Promise<RedactionCounts> {
  const counts: RedactionCounts = { email: 0, phone: 0, ssn: 0 };
  const body = context.document.body;

  for (const m of matches) {
    report(`Redacting ${m.kind}…`);

    const ranges = body.search(m.value, { matchCase: true });
    ranges.load("items");
    await context.sync();

    for (const r of ranges.items) {
      r.insertText(markerFor(m.kind), Word.InsertLocation.replace);
      counts[m.kind] += 1;
    }
    await context.sync();
  }

  return counts;
}
