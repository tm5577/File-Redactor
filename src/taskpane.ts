/// <reference types="office-js" />

import { getEls, setBusy, setStatus, showResults } from "./ui/dom.js";
import { runWord, formatOfficeError } from "./word/wordClient.js";
import { enableTrackingIfAvailable } from "./word/changeTracking.js";
import { ensureConfidentialHeaderAllSections } from "./word/header.js";
import { scanSensitive } from "./redaction/scanner.js";
import { redactBodyWithMatches } from "./redaction/apply.js";

Office.onReady((info) => {
  if (info.host !== Office.HostType.Word) return;

  const { runBtn, status } = getEls();
  runBtn.disabled = false;
  setStatus(status, "Ready.", "idle");

  runBtn.addEventListener("click", async () => {
    setBusy(runBtn, true);
    setStatus(status, "Running…", "idle");

    try {
      const results = await runRedactionPipeline((m) =>
        setStatus(status, m, "idle")
      );
      showResults(results);
      setStatus(status, "Done", "ok");
    } catch (err) {
      setStatus(status, "Error\n\n" + formatOfficeError(err), "error");
    } finally {
      setBusy(runBtn, false);
    }
  });
});

async function runRedactionPipeline(report: (msg: string) => void) {
  return runWord(async (context) => {
    report("Checking Track Changes support…");
    const trackChangesEnabled = enableTrackingIfAvailable(context);

    report(
      trackChangesEnabled
        ? "Track Changes enabled."
        : "Track Changes not available (WordApi 1.5 not supported)."
    );

    report("Ensuring confidentiality header…");
    const headerStatus = await ensureConfidentialHeaderAllSections(context);

    report("Loading document text…");
    const body = context.document.body;
    body.load("text");
    await context.sync();

    report("Scanning for sensitive info…");
    const matches = scanSensitive(body.text ?? "");

    report(
      `Found ${matches.length} unique sensitive value(s). Applying redactions…`
    );
    const counts = await redactBodyWithMatches(context, matches, report);

    return { trackChangesEnabled, headerStatus, counts };
  });
}
