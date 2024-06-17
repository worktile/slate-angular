---
"slate-angular": minor
---

1. In toDOMPoint, when the anchor or focus is on the block-card element and the selection is in the expanded state, the DOM selection is positioned on the cursor before and after, solving the problem that the beforeinput event cannot be triggered when the cursor is a block-card or void element (when the first element of the editor or table cell is a void element, Ctrl + A selects all) (contenteditable='false' is added to the void element)

2. Fix the problem of positioning the cursor before and after the block-card in toSlatePoint

1. toDOMPoint 中当 anchor 或者 focus 在 block-card 元素上并且选区是 expanded 状态时，将 DOM 的 selection 定位到前后光标的上，解决光标所在的元素是 block-card 和 void 元素（编辑器或者表格单元格的第一个元素是 void 元素时，Ctrl + A 全选）时无法触发 beforeinput 事件（void 元素上增加了 contenteditable='false'）

2. 修复 toSlatePoint 中对 block-card 前后光标定位的问题
