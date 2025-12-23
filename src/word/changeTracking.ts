import { isWordApiSupported } from "./wordClient.js";

export function enableTrackingIfAvailable(
  context: Word.RequestContext
): boolean {
  if (!isWordApiSupported("1.5")) return false;

  context.document.changeTrackingMode = Word.ChangeTrackingMode.trackAll;
  return true;
}
