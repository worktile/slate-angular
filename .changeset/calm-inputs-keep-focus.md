---
'slate-angular': patch
---

do not sync selection while a text input outside the editor is focused
in firefox the DOM selection stays in the editor when an external input is focused, so re-rendering (e.g. `decorate` changes while typing in a search box) called `setBaseAndExtent` and stole focus from the input, and the stale DOM selection was synced back to the editor selection
