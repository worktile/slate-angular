---
'slate-angular': patch
---

add `position: relative;` style to ensure pre rendering element's width is same as other elements

if pre rendering element does not have correct width(such as table in theia), it will cause style issue
