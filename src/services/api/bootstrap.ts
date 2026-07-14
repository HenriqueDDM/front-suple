/** @deprecated Prefer explicit login via AuthProvider. Kept for compatibility. */
export async function ensureApiReady(): Promise<void> {
  return Promise.resolve();
}
