---
'slate-angular': patch
---

remove css position: relative; from slate-editable-container since it will cause text rendering issue in svg foreign object #WIK-19892
we can remove it since we have set precision width for it
