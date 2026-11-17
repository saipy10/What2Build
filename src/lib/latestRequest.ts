/**
 * Ensures only the most recently started request is allowed to commit results.
 * Starting a new request aborts the previous one and marks it stale.
 */
export class LatestRequestGuard {
  private id = 0;
  private controller: AbortController | null = null;

  start(): { signal: AbortSignal; isCurrent: () => boolean } {
    this.controller?.abort();
    const controller = new AbortController();
    this.controller = controller;
    const myId = ++this.id;
    return {
      signal: controller.signal,
      isCurrent: () => this.id === myId,
    };
  }

  cancel(): void {
    this.id++;
    this.controller?.abort();
    this.controller = null;
  }
}
