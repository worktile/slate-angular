---
'slate-angular': patch
---

will do not measureHeightByIndics and cache heights when needAddOnTop is true and diff.changedIndexesOfTop.length > 1 because it add multiple elements in top and than pre-render will not work and may make performance issue

to fix virtual top height will not be right when add multiple elements in top and correct virtual top height after measureHeightByIndics be executed #WIK-19906
