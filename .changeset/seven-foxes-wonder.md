---
"slate-angular": minor
---

1. toDOMPoint 中当 anchor 或者 focus 在 block-card 元素上并且选区是 expanded 状态时，将 DOM 的 selection 定位到前后光标的上，解决光标所在的元素是 block-card 和 void 元素（编辑器或者表格单元格的第一个元素是 void 元素时，Ctrl + A 全选）时无法触发 beforeinput 事件（void 元素上增加了 contenteditable='false'）

2. 修复 toSlatePoint 中对 block-card 前后光标定位的问题（需要确认下这样的选区下的操作会不会造成脏数据，比如按下 backspace）