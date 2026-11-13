---
'slate-angular': patch
---

Strip `.the-break-char` / `.link-break-char` placeholders from the clipboard DOM on copy/cut/drag so `text/plain` no longer contains NBSP that breaks pasted terminal commands.
