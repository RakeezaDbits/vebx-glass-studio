/** In-memory pub/sub so SSE clients refetch as soon as a message is stored (visitor or admin). */

/** @type {Map<number, Set<() => void>>} */
const subs = new Map();

export function liveChatNotifySubscribe(sessionDbId, onNotify) {
  if (!subs.has(sessionDbId)) subs.set(sessionDbId, new Set());
  subs.get(sessionDbId).add(onNotify);
  return () => {
    const set = subs.get(sessionDbId);
    if (!set) return;
    set.delete(onNotify);
    if (set.size === 0) subs.delete(sessionDbId);
  };
}

export function liveChatNotifyPublish(sessionDbId) {
  const set = subs.get(sessionDbId);
  if (!set?.size) return;
  for (const fn of [...set]) {
    try {
      fn();
    } catch (e) {
      console.error("[live chat notify]", e);
    }
  }
}
