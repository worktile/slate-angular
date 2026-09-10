---
'slate-angular': patch
---

remove obsolete firefox focus compat in toNativeSelection
it focused the editor in a setTimeout after updating the native selection, which stole focus from inputs focused in between (e.g. the input of a newly inserted tag) in firefox
