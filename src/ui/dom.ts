export type Results = {
  trackChangesEnabled: boolean;
  headerStatus: "Added" | "Already existed";
  counts: { email: number; phone: number; ssn: number };
};

export function getEls() {
  const runBtn = document.getElementById("run-btn") as HTMLButtonElement;
  const status = document.getElementById("status") as HTMLDivElement;

  const resultsWrap = document.getElementById("results") as HTMLDivElement;
  const rTrack = document.getElementById("r-track") as HTMLElement;
  const rHeader = document.getElementById("r-header") as HTMLElement;
  const rEmails = document.getElementById("r-emails") as HTMLElement;
  const rPhones = document.getElementById("r-phones") as HTMLElement;
  const rSsns = document.getElementById("r-ssns") as HTMLElement;

  return {
    runBtn,
    status,
    resultsWrap,
    rTrack,
    rHeader,
    rEmails,
    rPhones,
    rSsns,
  };
}

export function setBusy(runBtn: HTMLButtonElement, busy: boolean) {
  runBtn.disabled = busy;
}

export function setStatus(
  statusEl: HTMLElement,
  text: string,
  variant: "idle" | "ok" | "error" = "idle"
) {
  statusEl.classList.remove("status--idle", "status--ok", "status--error");
  statusEl.classList.add(
    variant === "ok"
      ? "status--ok"
      : variant === "error"
      ? "status--error"
      : "status--idle"
  );
  statusEl.textContent = text;
}

export function showResults(r: Results) {
  const { resultsWrap, rTrack, rHeader, rEmails, rPhones, rSsns } = getEls();
  resultsWrap.hidden = false;

  rTrack.textContent = r.trackChangesEnabled ? "Yes" : "No";
  rHeader.textContent = r.headerStatus;
  rEmails.textContent = String(r.counts.email);
  rPhones.textContent = String(r.counts.phone);
  rSsns.textContent = String(r.counts.ssn);
}
