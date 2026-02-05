---
'slate-angular': patch
---

when selected elements and scroll, should not remove selected elements

The selected element continues to render during scrolling; the element range corresponding to the selected element and the elements within the viewport together constitute a new rendering range.
