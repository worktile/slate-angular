---
"slate-angular": patch
---

the beforeinput event will not fire while use press `deleteBackward` on void block element since remove contentEditable form void text element, so invoke deleteBackward manually as inline void element
