export function useMutationObserver(
  node: HTMLElement,
  callback: MutationCallback,
  options: MutationObserverInit
) {
  const mutationObserver = new MutationObserver(callback);

  mutationObserver.takeRecords();

  if (!node) {
    throw new Error("Failed to attach MutationObserver, `node` is undefined");
  }

  mutationObserver.observe(node, options);
  return () => mutationObserver.disconnect();
}
