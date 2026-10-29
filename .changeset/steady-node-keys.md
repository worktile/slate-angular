---
'slate-angular': patch
---

Preserve the original node key when splitting a node and the target node key when merging nodes. This keeps existing Angular views and their child components mounted when the node remains in place.

This follows Slate's [split and merge key handling PR](https://github.com/ianstormtaylor/slate/pull/4901), now implemented in [`slate-dom`'s `withDOM`](https://github.com/ianstormtaylor/slate/blob/main/packages/slate-dom/src/plugin/with-dom.ts).
