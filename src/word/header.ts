const CONF_HEADER_TEXT = "CONFIDENTIAL DOCUMENT";

export async function ensureConfidentialHeaderAllSections(
  context: Word.RequestContext
): Promise<"Added" | "Already existed"> {
  const sections = context.document.sections;
  sections.load("items");
  await context.sync();

  let addedAny = false;

  for (const section of sections.items) {
    const headerBody = section.getHeader("Primary");
    headerBody.load("text");
    await context.sync();

    const existing = (headerBody.text ?? "").trim();
    if (existing.includes(CONF_HEADER_TEXT)) continue;

    const prefix = existing.length > 0 ? "\n" : "";
    headerBody.insertText(prefix + CONF_HEADER_TEXT, Word.InsertLocation.end);

    addedAny = true;
    await context.sync();
  }

  return addedAny ? "Added" : "Already existed";
}
