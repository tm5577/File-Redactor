export async function runWord<T>(
  fn: (context: Word.RequestContext) => Promise<T>
): Promise<T> {
  return Word.run(fn);
}

export function isWordApiSupported(version: "1.5"): boolean {
  try {
    return Office.context.requirements.isSetSupported("WordApi", version);
  } catch {
    return false;
  }
}

export function formatOfficeError(err: unknown): string {
  const e = err as any;
  if (e?.debugInfo) {
    const loc = e.debugInfo.errorLocation
      ? `\nLocation: ${e.debugInfo.errorLocation}`
      : "";
    return `${e.message ?? "Error"}${loc}`;
  }
  return (e?.message as string) ?? String(err);
}
