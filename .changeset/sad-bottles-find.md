---
'slate-angular': patch
---

Change the container width change clearing to height

- This operation is to prevent the problem of inconsistent height calculation caches under containers of different widths.
- If not cleared, the cache heights under different containers will be mixed, leading to errors in rendering calculations.
