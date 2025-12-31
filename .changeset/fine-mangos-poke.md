---
'slate-angular': patch
---

remove syncScrollTop logic in calculateVirtualViewport

will trigger `selectionchange` event and clear editor's selection if syncScrollTop is called and selection is not in viewport
