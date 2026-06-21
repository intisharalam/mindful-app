export type HistoryContentType = "video" | "book";

/**
 * Fire-and-forget history log. Failures are swallowed deliberately —
 * history is a nice-to-have view of activity, not something that should
 * ever block or disrupt the actual content-viewing experience.
 */
export function logHistoryView(
  contentType: HistoryContentType,
  contentId: number
): void {
  fetch("/api/history", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType, contentId }),
  }).catch(() => {
    // Best-effort only.
  });
}
