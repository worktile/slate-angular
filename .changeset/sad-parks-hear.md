---
'slate-angular': patch
---

remove force param in measureHeightByIndics, if element include async request the measured height will not be right and can not update the height in time and this scenario do not have any question in debug mode so we can remove it and it will always remeasure the height
