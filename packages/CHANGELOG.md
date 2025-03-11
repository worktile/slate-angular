# Changelog

## 18.0.1

### Patch Changes

-   [#282](https://github.com/worktile/slate-angular/pull/282) [`7cb4403`](https://github.com/worktile/slate-angular/commit/7cb44033baf235f18e100d41d923de6315fd806c) Thanks [@Maple13](https://github.com/Maple13)! - removed extra injection chain caused by

## 18.0.0

### Major Changes

-   [`bd823a1`](https://github.com/worktile/slate-angular/commit/bd823a16f2e76c31a9b068170758d8a077ab421c) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - upgrade angular into 18

## 17.4.5

### Patch Changes

-   [#279](https://github.com/worktile/slate-angular/pull/279) [`4bb97c8`](https://github.com/worktile/slate-angular/commit/4bb97c8b5fae45ae2bb03725b1f58362db7e2b4a) Thanks [@Maple13](https://github.com/Maple13)! - fix setFragmentData error

## 18.0.0-next.0

### Major Changes

-   [`9a4178b`](https://github.com/worktile/slate-angular/commit/9a4178be6b05590bb7229d3981a81981b6fdcae3) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - upgrade angular into 18

## 17.4.4

### Patch Changes

-   [#277](https://github.com/worktile/slate-angular/pull/277) [`afd2ff3`](https://github.com/worktile/slate-angular/commit/afd2ff3941685114e34057e97f9790e4157da9d4) Thanks [@Maple13](https://github.com/Maple13)! - complete the table element structure obtained through the selection

## 17.4.3

### Patch Changes

-   [`ec1cb4b`](https://github.com/worktile/slate-angular/commit/ec1cb4b5dd5e50fbde51bc707b0c4bd6c47767a1) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Should not replace focusNode by anchorNode that will cause selection waring when focusNode is in contenteditable
    Should return null instead of returning an error range when domRange is invalid

## 17.4.2

### Patch Changes

-   [`4b60ed3`](https://github.com/worktile/slate-angular/commit/4b60ed343fe0803bfbe451b2f5055f8c163fa99b) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - exec scrollSelectionIntoView in setTimeout
    to determine the dom should have been updated when exec scrollSelectionIntoView

## 17.4.1

### Patch Changes

-   [#276](https://github.com/worktile/slate-angular/pull/276) [`1c63833`](https://github.com/worktile/slate-angular/commit/1c6383306e8cc388b2bc92fc8952858f7f664d82) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - prevent set `contenteditable='false'` for inline void element

## 17.4.0

### Minor Changes

-   [#275](https://github.com/worktile/slate-angular/pull/275) [`9da5fae`](https://github.com/worktile/slate-angular/commit/9da5faec83090b03615728decc560b865e195424) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - should return both text/html and files when clipboard has files

## 17.3.0

### Minor Changes

-   [#273](https://github.com/worktile/slate-angular/pull/273) [`c65fea2`](https://github.com/worktile/slate-angular/commit/c65fea27c15e83a78c76fc3d4bf3d45fa03b2845) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - 1. In toDOMPoint, when the anchor or focus is on the block-card element and the selection is in the expanded state, the DOM selection is positioned on the cursor before and after, solving the problem that the beforeinput event cannot be triggered when the cursor is a block-card or void element (when the first element of the editor or table cell is a void element, Ctrl + A selects all) (contenteditable='false' is added to the void element)

    2. Fix the problem of positioning the cursor before and after the block-card in toSlatePoint
    1. toDOMPoint 中当 anchor 或者 focus 在 block-card 元素上并且选区是 expanded 状态时，将 DOM 的 selection 定位到前后光标的上，解决光标所在的元素是 block-card 和 void 元素（编辑器或者表格单元格的第一个元素是 void 元素时，Ctrl + A 全选）时无法触发 beforeinput 事件（void 元素上增加了 contenteditable='false'）
    1. 修复 toSlatePoint 中对 block-card 前后光标定位的问题

-   [#274](https://github.com/worktile/slate-angular/pull/274) [`2b7598e`](https://github.com/worktile/slate-angular/commit/2b7598e1bdde127e3b76ccb962abd988557efc66) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - bump slate into 0.103.0

## 17.2.2

### Patch Changes

-   [#271](https://github.com/worktile/slate-angular/pull/271) [`39ac800`](https://github.com/worktile/slate-angular/commit/39ac800ae1c5dfb23f53d3ef0d430d8c594058df) Thanks [@huanhuanwa](https://github.com/huanhuanwa)! - only exec JSON.stringify for element

## 17.2.1

### Patch Changes

-   [`e2cb948`](https://github.com/worktile/slate-angular/commit/e2cb94819f97e3f29111b8af79ef8c6353a54a34) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Revert "feat(core): remove slate-children/slate-leaves/SlateChildren/SlateLeaves"

## 17.2.0

### Minor Changes

-   [`b45c27f`](https://github.com/worktile/slate-angular/commit/b45c27f1b99f38b5958425fcd057a25684c5a5ac) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - remove slate-children/slate-leaves/SlateChildren/SlateLeaves

    BREAKING CHANGE: the code segment using slate-children/slate-leaves/SlateChildren/SlateLeaves need been removed

-   [#267](https://github.com/worktile/slate-angular/pull/267) [`146b69e`](https://github.com/worktile/slate-angular/commit/146b69e3e9d2c770a8236683a602d1ceb5bafb9f) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - apply navigator api and provider setClipboardData and getClipboardData methods

## 17.1.3

### Patch Changes

-   [`13ef6ac`](https://github.com/worktile/slate-angular/commit/13ef6acd7555f8e6bfb02df00cad7aa289f2cba2) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - use map queue to store afterViewInit callback

    fix the issue that inline void element can not bind contentEditable attribute correctly

## 17.1.2

### Patch Changes

-   [#265](https://github.com/worktile/slate-angular/pull/265) [`d9a14cc`](https://github.com/worktile/slate-angular/commit/d9a14cc885506357434492098e44105f5049efc6) Thanks [@huanhuanwa](https://github.com/huanhuanwa)! - fix isBlockCardLeftCursor and isBlockCardRightCursor error

## 17.1.1

### Patch Changes

-   [`cf192c3`](https://github.com/worktile/slate-angular/commit/cf192c3aa91eeb2f4556d74081b07dfa8f125ec1) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - don't invoke normalize method default

## 17.1.0

### Minor Changes

-   [`2b04410`](https://github.com/worktile/slate-angular/commit/2b04410d357b78b2942331c9472b40884ac84377) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - merge list-render pre release

## 16.1.0

### Minor Changes

-   [#242](https://github.com/worktile/slate-angular/pull/242) [`bcfe6ab`](https://github.com/worktile/slate-angular/commit/bcfe6abfde24189db8040459f0bfbaa47dce911a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - initialize list render and leaves render to optimized rendering performance
    deprecated container

-   [`4b7cbb6`](https://github.com/worktile/slate-angular/commit/4b7cbb6bcaed1ef1aaa9f51efc24fbb264bc9e4e) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support suppressThrow in toSlateRange/toSlatePoint/isLeafInEditor to check domSelection is valid

-   [#246](https://github.com/worktile/slate-angular/pull/246) [`2fa7dd7`](https://github.com/worktile/slate-angular/commit/2fa7dd72d29c18fbbae0998ca94c3800c75839fd) Thanks [@Bricklou](https://github.com/Bricklou)! - Update dependencies (like slate) to latest versions

-   [#242](https://github.com/worktile/slate-angular/pull/242) [`fface3b`](https://github.com/worktile/slate-angular/commit/fface3b4fc907b7f569a06d23a2ebf22bf2803ba) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - improve isLineBreakEmptyString、forEachMovedItem、setBaseAndExtent performance issues

### Patch Changes

-   [#250](https://github.com/worktile/slate-angular/pull/250) [`40f4214`](https://github.com/worktile/slate-angular/commit/40f4214e86ad60b30ce7cf9a1c4cf6287e88823d) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support custom elements to set the position of children elements

-   [`f3395b1`](https://github.com/worktile/slate-angular/commit/f3395b1937979236cade5d510c4ed62f1bfaa06a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - the beforeinput event will not fire while use press `deleteBackward` on void block element since remove contentEditable form void text element, so invoke deleteBackward manually as inline void element

-   [`5d7d22d`](https://github.com/worktile/slate-angular/commit/5d7d22d5fe11cf2a666b4b5dc3d5613b83035f09) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add hasAfterContextChange that the timing is after detectChanges

-   [`b494e6d`](https://github.com/worktile/slate-angular/commit/b494e6d8587562b0dae5d356c9acbabb8f714fa9) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Update README:

    1. depend on slate@0.101.5
    2. remove <slate-leaves></slate-leaves> from template of custom text component

-   [`4ef6370`](https://github.com/worktile/slate-angular/commit/4ef6370b65494715e2190afab64d46ecf11bfd14) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Fix error when triple-clicking a word preceding a `contenteditable="false"` DOM node in Chrome
    refer to: https://github.com/ianstormtaylor/slate/pull/5343

-   [`6eee752`](https://github.com/worktile/slate-angular/commit/6eee752297d0e447e9849e29a8c64b3691929bcc) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - remove path from SlateElementContext

-   [`db55c5c`](https://github.com/worktile/slate-angular/commit/db55c5c958de8d473504cc5a391d9098f1d178d7) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support overridable methods expanded to control the expanded or collapsed state of children view, such as toggle-list plugin

-   [`78bcc2b`](https://github.com/worktile/slate-angular/commit/78bcc2b539debcb69c55f917ddd7f4a526614452) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - isTargetInsideVoid add suppressThrow config

-   [`f122a37`](https://github.com/worktile/slate-angular/commit/f122a3770ea0851688ba4b7292e7c05b496b36c8) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - update block card append timing

-   [`f1e3831`](https://github.com/worktile/slate-angular/commit/f1e3831d107defbc0e1c4ca9a2e9fb035fa08ea3) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add contenteditable = 'false' when element is void（Revert recent logic changes）

-   [`0657338`](https://github.com/worktile/slate-angular/commit/065733809960ec3c50c1c24f5bb92f1944760bfc) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - use parent element of outlet to insert fragment

-   [`34a268a`](https://github.com/worktile/slate-angular/commit/34a268a4ce2291432c4951b86d2c0ff1d6748fe3) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - get template's root nodes by data-slate-node and data-slate-leaf attribute to avoid operating other HTMLElement

-   [`fa62932`](https://github.com/worktile/slate-angular/commit/fa629326a82c4245f5d2c3d1ce99ed734c5f418b) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fix query void text error

-   [`52fcaa1`](https://github.com/worktile/slate-angular/commit/52fcaa1f7cb6a680c02cdbc1a96059e30e8f1b53) Thanks [@huanhuanwa](https://github.com/huanhuanwa)! - prevent move selection when selection is in left or right cursor when click up

-   [`b4f5020`](https://github.com/worktile/slate-angular/commit/b4f5020e1406cf147f5cc7c9b35ac11d5486dcde) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - export throttle utils

-   [`e59cc1d`](https://github.com/worktile/slate-angular/commit/e59cc1db93672b9379b0937f72e21b86a2d28ead) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - should invoke initialize when previous children is empty

-   [`0c59f49`](https://github.com/worktile/slate-angular/commit/0c59f492371b901c3bb7791b9a2bf2cc166e42af) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - cancel throttleRAF for setBaseAndExtent

-   [`ae78be8`](https://github.com/worktile/slate-angular/commit/ae78be824c2a6fb03ea88c3c9920ff122da1451d) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - update detect changes timing when set context

-   [`a43d313`](https://github.com/worktile/slate-angular/commit/a43d313d7bcfdfa277a2093d2687d32685561264) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - execute detectChanges after create black card component to avoid incorrect render timing of left and right caret

-   [`edd539d`](https://github.com/worktile/slate-angular/commit/edd539d6abd59787c2c9c65ca5fe0effddfd31e1) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - update NODE_TO_INDEX and NODE_TO_PARENT when diffResult is undefined

-   [#253](https://github.com/worktile/slate-angular/pull/253) [`fa01d81`](https://github.com/worktile/slate-angular/commit/fa01d81fbfd3c932cb4147d8175da46ff42cca29) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - handle triple-click
    remove the attribute of editable='false' in void element to void strange behavior when click before image element
    refer to:
    https://github.com/ianstormtaylor/slate/pull/4588
    https://github.com/ianstormtaylor/slate/pull/4965

-   [`46d0659`](https://github.com/worktile/slate-angular/commit/46d0659f932923224af411798b57255f7003327e) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add afterViewInit method to handle performance issue
    set contenteditable will cause performance issue during dynamic created component execute detectChanges

## 16.1.0-next.20

### Patch Changes

-   [`f3395b1`](https://github.com/worktile/slate-angular/commit/f3395b1937979236cade5d510c4ed62f1bfaa06a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - the beforeinput event will not fire while use press `deleteBackward` on void block element since remove contentEditable form void text element, so invoke deleteBackward manually as inline void element

## 16.1.0-next.19

### Patch Changes

-   [`52fcaa1`](https://github.com/worktile/slate-angular/commit/52fcaa1f7cb6a680c02cdbc1a96059e30e8f1b53) Thanks [@huanhuanwa](https://github.com/huanhuanwa)! - prevent move selection when selection is in left or right cursor when click up

-   [`edd539d`](https://github.com/worktile/slate-angular/commit/edd539d6abd59787c2c9c65ca5fe0effddfd31e1) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - update NODE_TO_INDEX and NODE_TO_PARENT when diffResult is undefined

## 16.1.0-next.18

### Patch Changes

-   [`46d0659`](https://github.com/worktile/slate-angular/commit/46d0659f932923224af411798b57255f7003327e) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add afterViewInit method to handle performance issue
    set contenteditable will cause performance issue during dynamic created component execute detectChanges

## 16.1.0-next.17

### Patch Changes

-   [`a43d313`](https://github.com/worktile/slate-angular/commit/a43d313d7bcfdfa277a2093d2687d32685561264) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - execute detectChanges after create black card component to avoid incorrect render timing of left and right caret

## 16.1.0-next.16

### Patch Changes

-   [`78bcc2b`](https://github.com/worktile/slate-angular/commit/78bcc2b539debcb69c55f917ddd7f4a526614452) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - isTargetInsideVoid add suppressThrow config

## 16.1.0-next.15

### Minor Changes

-   [`4b7cbb6`](https://github.com/worktile/slate-angular/commit/4b7cbb6bcaed1ef1aaa9f51efc24fbb264bc9e4e) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support suppressThrow in toSlateRange/toSlatePoint/isLeafInEditor to check domSelection is valid

## 16.1.0-next.14

### Patch Changes

-   [`e59cc1d`](https://github.com/worktile/slate-angular/commit/e59cc1db93672b9379b0937f72e21b86a2d28ead) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - should invoke initialize when previous children is empty

## 16.1.0-next.13

### Patch Changes

-   [`34a268a`](https://github.com/worktile/slate-angular/commit/34a268a4ce2291432c4951b86d2c0ff1d6748fe3) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - get template's root nodes by data-slate-node and data-slate-leaf attribute to avoid operating other HTMLElement

## 16.1.0-next.12

### Patch Changes

-   [`f1e3831`](https://github.com/worktile/slate-angular/commit/f1e3831d107defbc0e1c4ca9a2e9fb035fa08ea3) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add contenteditable = 'false' when element is void（Revert recent logic changes）

## 16.1.0-next.11

### Patch Changes

-   [`db55c5c`](https://github.com/worktile/slate-angular/commit/db55c5c958de8d473504cc5a391d9098f1d178d7) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support overridable methods expanded to control the expanded or collapsed state of children view, such as toggle-list plugin

## 16.1.0-next.10

### Patch Changes

-   [`0657338`](https://github.com/worktile/slate-angular/commit/065733809960ec3c50c1c24f5bb92f1944760bfc) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - use parent element of outlet to insert fragment

## 16.1.0-next.9

### Patch Changes

-   [`b494e6d`](https://github.com/worktile/slate-angular/commit/b494e6d8587562b0dae5d356c9acbabb8f714fa9) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Update README:

    1. depend on slate@0.101.5
    2. remove <slate-leaves></slate-leaves> from template of custom text component

-   [`4ef6370`](https://github.com/worktile/slate-angular/commit/4ef6370b65494715e2190afab64d46ecf11bfd14) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Fix error when triple-clicking a word preceding a `contenteditable="false"` DOM node in Chrome
    refer to: https://github.com/ianstormtaylor/slate/pull/5343

-   [#253](https://github.com/worktile/slate-angular/pull/253) [`fa01d81`](https://github.com/worktile/slate-angular/commit/fa01d81fbfd3c932cb4147d8175da46ff42cca29) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - handle triple-click
    remove the attribute of editable='false' in void element to void strange behavior when click before image element
    refer to:
    https://github.com/ianstormtaylor/slate/pull/4588
    https://github.com/ianstormtaylor/slate/pull/4965

## 16.1.0-next.8

### Minor Changes

-   [#246](https://github.com/worktile/slate-angular/pull/246) [`2fa7dd7`](https://github.com/worktile/slate-angular/commit/2fa7dd72d29c18fbbae0998ca94c3800c75839fd) Thanks [@Bricklou](https://github.com/Bricklou)! - Update dependencies (like slate) to latest versions

### Patch Changes

-   [#250](https://github.com/worktile/slate-angular/pull/250) [`40f4214`](https://github.com/worktile/slate-angular/commit/40f4214e86ad60b30ce7cf9a1c4cf6287e88823d) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support custom elements to set the position of children elements

## 16.1.0-next.7

### Patch Changes

-   [`5d7d22d`](https://github.com/worktile/slate-angular/commit/5d7d22d5fe11cf2a666b4b5dc3d5613b83035f09) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add hasAfterContextChange that the timing is after detectChanges

## 16.1.0-next.6

### Patch Changes

-   [`ae78be8`](https://github.com/worktile/slate-angular/commit/ae78be824c2a6fb03ea88c3c9920ff122da1451d) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - update detect changes timing when set context

## 16.1.0-next.5

### Patch Changes

-   [`6eee752`](https://github.com/worktile/slate-angular/commit/6eee752297d0e447e9849e29a8c64b3691929bcc) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - remove path from SlateElementContext

## 16.1.0-next.4

### Patch Changes

-   [`b4f5020`](https://github.com/worktile/slate-angular/commit/b4f5020e1406cf147f5cc7c9b35ac11d5486dcde) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - export throttle utils

## 16.1.0-next.3

### Patch Changes

-   [`f122a37`](https://github.com/worktile/slate-angular/commit/f122a3770ea0851688ba4b7292e7c05b496b36c8) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - update block card append timing

## 16.1.0-next.2

### Patch Changes

-   [`fa62932`](https://github.com/worktile/slate-angular/commit/fa629326a82c4245f5d2c3d1ce99ed734c5f418b) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fix query void text error

## 16.1.0-next.1

### Patch Changes

-   [`0c59f49`](https://github.com/worktile/slate-angular/commit/0c59f492371b901c3bb7791b9a2bf2cc166e42af) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - cancel throttleRAF for setBaseAndExtent

## 16.1.0-next.0

### Minor Changes

-   [#242](https://github.com/worktile/slate-angular/pull/242) [`bcfe6ab`](https://github.com/worktile/slate-angular/commit/bcfe6abfde24189db8040459f0bfbaa47dce911a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - initialize list render and leaves render to optimized rendering performance
    deprecated container

-   [#242](https://github.com/worktile/slate-angular/pull/242) [`fface3b`](https://github.com/worktile/slate-angular/commit/fface3b4fc907b7f569a06d23a2ebf22bf2803ba) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - improve isLineBreakEmptyString、forEachMovedItem、setBaseAndExtent performance issues

## 17.0.0

### Major Changes

-   [#258](https://github.com/worktile/slate-angular/pull/258) [`ec6262d`](https://github.com/worktile/slate-angular/commit/ec6262dcfb302a5ab11882178feaeb2bbbc55e43) Thanks [@cmm-va](https://github.com/cmm-va)! - build: bump angular to 17

## 17.0.0-next.0

### Major Changes

-   [#258](https://github.com/worktile/slate-angular/pull/258) [`ec6262d`](https://github.com/worktile/slate-angular/commit/ec6262dcfb302a5ab11882178feaeb2bbbc55e43) Thanks [@cmm-va](https://github.com/cmm-va)! - build: bump angular to 17

## 16.1.0-next

### Minor Changes

-   [`406acf4`](https://github.com/worktile/slate-angular/commit/406acf4abf8a7dde716a11246ead9fd9db36f380) Thanks [@why520crazy](https://github.com/why520crazy)! - feat: bump is-hotkey and direction to 0.2.0 and 2.0.1, add dependence of package.json

-   [`d2045d7`](https://github.com/worktile/slate-angular/commit/d2045d79cbd8db0af6238fe92de51cf3dc21cb14) Thanks [@why520crazy](https://github.com/why520crazy)! - feat: remove all Component suffix to simplify usage of standalone components

-   [`51cda1a`](https://github.com/worktile/slate-angular/commit/51cda1a3766cb0102e57a119b8c3100f8233a72a) Thanks [@why520crazy](https://github.com/why520crazy)! - feat(core): support standalone components

## 15.1.3

### Patch Changes

-   [`dd5c1b2`](https://github.com/worktile/slate-angular/commit/dd5c1b2a60bad3ed17eaad48611515f56001fc94) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - should set viewContext before set context

## 15.1.2

### Patch Changes

-   [`e163f01`](https://github.com/worktile/slate-angular/commit/e163f01ed5d9cc7265df17668622543e79bff33d) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add isLeafInEditor and isNodeInEditor to test target leaf whether belong to current editor
    correct selection when focus in void element include slate-angular component

## 15.1.1

### Patch Changes

-   [`a9610f0`](https://github.com/worktile/slate-angular/commit/a9610f07c407de468433716ee121f8090127210e) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - do not invoke scrollSelectionIntoView when newDomRange is null

## 15.1.0

### Minor Changes

-   [#230](https://github.com/worktile/slate-angular/pull/230) [`08f1b72`](https://github.com/worktile/slate-angular/commit/08f1b722392a0c7d2873db11dd7cd329c24aba0b) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support scrollSelectionIntoView and defaultScrollSelectionIntoView method

-   [#227](https://github.com/worktile/slate-angular/pull/227) [`05d46dd`](https://github.com/worktile/slate-angular/commit/05d46dd144d585e0f5795fd294bcc30ed9fcba7d) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - android input handing

-   [#228](https://github.com/worktile/slate-angular/pull/228) [`afc99b0`](https://github.com/worktile/slate-angular/commit/afc99b066e0e6e0a01b419d882d9becea8c76884) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add default string component

### Patch Changes

-   [`8f443fd`](https://github.com/worktile/slate-angular/commit/8f443fd5c32af182453276c9bbd300750d444026) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - remove textNode and br on previous type is lineBreakEmptyString
    export defaultScrollSelectionIntoView function

-   [`cf4e323`](https://github.com/worktile/slate-angular/commit/cf4e323c09ad60aacc54083d5648e4c33dcf5d2c) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - export hasEditableTarget and composition update event

-   [`64e3f81`](https://github.com/worktile/slate-angular/commit/64e3f81fcb8dac22b6712b257e50e25dd76358e3) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - android issue: get targetRange from dom selection when event can not get nativeTargetRange

-   [`1a32c9e`](https://github.com/worktile/slate-angular/commit/1a32c9ef6851f35025b22e5cd5d879d1fd473ada) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - handle scroll issue when cursor in the black card

-   [`20b5cb5`](https://github.com/worktile/slate-angular/commit/20b5cb524fcb48b97f20468601112c70d4dbeac5) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - handle insertText in Android device

-   [`a691d0b`](https://github.com/worktile/slate-angular/commit/a691d0b1a5077ffee2c3eb868a30f11eb7cbd1bd) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Text nodes support generic T

-   [`a7348cd`](https://github.com/worktile/slate-angular/commit/a7348cdbbd49dc263cd7d8176939d575236b3511) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - solved innerText render error for '\n'

-   [#231](https://github.com/worktile/slate-angular/pull/231) [`fb749c5`](https://github.com/worktile/slate-angular/commit/fb749c5789f7e10312d7821fc92c92eb5acc6b19) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - default string support lineBreakEmptyString

## 15.1.0-next.4

### Patch Changes

-   [`8f443fd`](https://github.com/worktile/slate-angular/commit/8f443fd5c32af182453276c9bbd300750d444026) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - remove textNode and br on previous type is lineBreakEmptyString
    export defaultScrollSelectionIntoView function

## 15.1.0-next.3

### Patch Changes

-   [#231](https://github.com/worktile/slate-angular/pull/231) [`fb749c5`](https://github.com/worktile/slate-angular/commit/fb749c5789f7e10312d7821fc92c92eb5acc6b19) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - default string support lineBreakEmptyString

## 15.1.0-next.2

### Minor Changes

-   [#230](https://github.com/worktile/slate-angular/pull/230) [`08f1b72`](https://github.com/worktile/slate-angular/commit/08f1b722392a0c7d2873db11dd7cd329c24aba0b) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support scrollSelectionIntoView and defaultScrollSelectionIntoView method

## 15.1.0-next.1

### Patch Changes

-   [`64e3f81`](https://github.com/worktile/slate-angular/commit/64e3f81fcb8dac22b6712b257e50e25dd76358e3) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - android issue: get targetRange from dom selection when event can not get nativeTargetRange

## 15.1.0-next.0

### Minor Changes

-   [#227](https://github.com/worktile/slate-angular/pull/227) [`05d46dd`](https://github.com/worktile/slate-angular/commit/05d46dd144d585e0f5795fd294bcc30ed9fcba7d) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - android input handing

-   [#228](https://github.com/worktile/slate-angular/pull/228) [`afc99b0`](https://github.com/worktile/slate-angular/commit/afc99b066e0e6e0a01b419d882d9becea8c76884) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add default string component

### Patch Changes

-   [`20b5cb5`](https://github.com/worktile/slate-angular/commit/20b5cb524fcb48b97f20468601112c70d4dbeac5) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - handle insertText in Android device

-   [`a7348cd`](https://github.com/worktile/slate-angular/commit/a7348cdbbd49dc263cd7d8176939d575236b3511) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - solved innerText render error for '\n'

## 15.0.0

### Major Changes

-   [#223](https://github.com/worktile/slate-angular/pull/223) [`ad8ce3f`](https://github.com/worktile/slate-angular/commit/ad8ce3fc87bc221d811a17947e30f9dc21144f21) Thanks [@Maple13](https://github.com/Maple13)! - optimizing angular 15 upgrade

*   [#222](https://github.com/worktile/slate-angular/pull/222) [`33095ae`](https://github.com/worktile/slate-angular/commit/33095ae08bd56b69723ad8777e04e45c23cc5f28) Thanks [@Ashy6](https://github.com/Ashy6)! - 升级 Angular 15

## 14.1.3

### Patch Changes

-   [#220](https://github.com/worktile/slate-angular/pull/220) [`b3525ab`](https://github.com/worktile/slate-angular/commit/b3525ab1d5579fc47800b37aeee14b2ed480a8b9) Thanks [@donaldxdonald](https://github.com/donaldxdonald)! - fix legacy check for Edge and Firefox v100+

*   [`27591d4`](https://github.com/worktile/slate-angular/commit/27591d4dd8e02dc8944b71e650d804f357879afa) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - use break-spaces value for white-space, avoid end-of-line hang

## 14.1.2

### Patch Changes

-   [`3a538b0`](https://github.com/worktile/slate-angular/commit/3a538b09422031b2bac9e1561401ef64421b1742) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support dynamic placeholder

## 14.1.1

### Patch Changes

-   [`98548be`](https://github.com/worktile/slate-angular/commit/98548bede7a0ea8e94cc34e4bfd4caf4310c89ad) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - prevent updating native selection when active element is void element

## 14.0.0

### Major Changes

-   [`c065c98`](https://github.com/worktile/slate-angular/commit/c065c986ef41aff45ee20626ba0b16575574fbef) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - 升级 Angular 14

## 13.1.0

### Minor Changes

-   [`cbc2b33`](https://github.com/worktile/slate-angular/commit/cbc2b33364c2454529f67ff01f81cf25abc52292) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - use context selection calc isCollapsed and resolve editor is undefined error

## 13.0.6

### Patch Changes

-   [`deeed17`](https://github.com/worktile/slate-angular/commit/deeed17c488a830913763bdb62f3e501ab260be1) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add isCollapsedAndNonReadonly property

## 13.0.5

### Patch Changes

-   [`e79030a`](https://github.com/worktile/slate-angular/commit/e79030ab6e1d22a8d99601e268f1e55f0dbe0955) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - stop beforeinput event handle when focus void node

## 13.0.4

### Patch Changes

-   [`2c3d403`](https://github.com/worktile/slate-angular/commit/2c3d403977f8b1933049f194d0e3bd6f3596e43e) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - stop keydown action when focus node

## 13.0.3

### Patch Changes

-   [`ed86a61`](https://github.com/worktile/slate-angular/commit/ed86a618348eb7c0d9b539a3cc3300a6170e7f9a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Solve the problem that the editable area in the Void node is abnormally out of focus

## 13.0.2

### Patch Changes

-   [#207](https://github.com/worktile/slate-angular/pull/207) [`625886b`](https://github.com/worktile/slate-angular/commit/625886b20efbfa3f2e21e67a9834f08b05687fea) Thanks [@donaldxdonald](https://github.com/donaldxdonald)! - Allow copying of slate nodes in readonly mode

## 13.0.1

### Patch Changes

-   [`75de637`](https://github.com/worktile/slate-angular/commit/75de637821f650d64c7410ed5ef5d07de24e8d7f) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - [build] add license for npm package

## 13.0.0

### Major Changes

-   [#203](https://github.com/worktile/slate-angular/pull/203) [`4809484`](https://github.com/worktile/slate-angular/commit/4809484df20a81ff61307606dbb23be6afd12f18) Thanks [@why520crazy](https://github.com/why520crazy)! - [deps] upgrade angular 13

## 1.9.3

### Patch Changes

-   [#195](https://github.com/worktile/slate-angular/pull/195) [`9d00976`](https://github.com/worktile/slate-angular/commit/9d00976573608d15a5accb1131785d025f207274) Thanks [@huanhuanwa](https://github.com/huanhuanwa)! - [utils]: Fix the RegExp of judging the old version of chrome

## 1.9.2

### Patch Changes

-   [#191](https://github.com/worktile/slate-angular/pull/191) [`1f32060`](https://github.com/worktile/slate-angular/commit/1f320608e9e968f2fb8d1b963cfdd09ed4efab5a) Thanks [@huanhuanwa](https://github.com/huanhuanwa)! - in move_node, replace path with pathRef

## 1.9.1

### Patch Changes

-   [#185](https://github.com/worktile/slate-angular/pull/185) [`bb237a8`](https://github.com/worktile/slate-angular/commit/bb237a8243aec0a4f1386b131cc5726b008aa7a4) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - remove native DOM selection when slate selection is null

*   [#188](https://github.com/worktile/slate-angular/pull/188) [`4e50b91`](https://github.com/worktile/slate-angular/commit/4e50b912b2f970e754cdb571f9fc9e570d89ba17) Thanks [@huanhuanwa](https://github.com/huanhuanwa)! - modify the method of getting matches in move_node

## 1.9.0

### Minor Changes

-   [#182](https://github.com/worktile/slate-angular/pull/182) [`2d3eb49`](https://github.com/worktile/slate-angular/commit/2d3eb49235aa8868d230268df8f851d8c949b605) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Solve the dom loss when moving nodes

## 1.8.0

### Minor Changes

-   [#178](https://github.com/worktile/slate-angular/pull/178) [`eec7fa3`](https://github.com/worktile/slate-angular/commit/eec7fa33fe21f87bfea10343d3ccf4b51ceb8164) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Add insertFragmentData and insertTextData to the AngularEditor API - sync slate-react

*   [#178](https://github.com/worktile/slate-angular/pull/178) [`bb9464d`](https://github.com/worktile/slate-angular/commit/bb9464d6af875c220daa2a40bd53e31f61d9ab36) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Add origin event type to setFragmentData to be able to distinguish copy, cut and drag

### Patch Changes

-   [#178](https://github.com/worktile/slate-angular/pull/178) [`8db5a01`](https://github.com/worktile/slate-angular/commit/8db5a01fbda8b52dc1b7cfb3b33831d6d8a87f48) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Fix crash on drag and drop image on readOnly editable

*   [#178](https://github.com/worktile/slate-angular/pull/178) [`af07fa4`](https://github.com/worktile/slate-angular/commit/af07fa44d76f2721ead57e75f2d84bb49037a53b) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Allow setFragmentData to work without copy/paste or DnD data structure

## 1.7.5

### Patch Changes

-   [#173](https://github.com/worktile/slate-angular/pull/173) [`1f164e9`](https://github.com/worktile/slate-angular/commit/1f164e9d556bd893aa79460bde1cc6c91a868923) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Fix focus movement and paragraph height issues under firefox

## 1.7.4

### Patch Changes

-   [`004015c`](https://github.com/worktile/slate-angular/commit/004015cbb97f45df9d51944147fffe290b31d49e) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - correct placeholder position, placeholder span must be inside text node

## 1.7.3

### Patch Changes

-   [#168](https://github.com/worktile/slate-angular/pull/168) [`4c6d50e`](https://github.com/worktile/slate-angular/commit/4c6d50ec090366f114191b8e696bb4ae9edbeb7c) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - refactor placeholder, fix IME input issues

## 1.7.2

### Patch Changes

-   [`3d7f548`](https://github.com/worktile/slate-angular/commit/3d7f5487b37116fa0113c8fbabff777c32b15eb9) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - 引入 changesets 工具

### [1.7.1](https://github.com/worktile/slate-angular/compare/v1.7.0...v1.7.1) (2022-01-12)

### Bug Fixes

-   **placeholder:** fix(placeholder): use default value when placeholderDecorate is empty
-   **core:** fix(core): check for existing context in BaseTextComponent.text

### [1.7.0](https://github.com/worktile/slate-angular/compare/v1.6.5...v1.7.0) (2021-12-23)

### Features

-   **placeholder:** feat(decorate): add placeholder (#159) 感谢 @FrankWang117

### Bug Fixes

-   **core:** handle move nodes Transforms.moveNodes does not work #150
-   **core:** fix(core): handling of delete in Chrome when inline void node is selected

### [1.6.5](https://github.com/worktile/slate-angular/compare/v1.6.4...v1.6.5) (2021-11-03)

### Features

-   **core:** feat(core): bump slate to 0.67.1 and remove override normalizeNode

### [1.6.4](https://github.com/worktile/slate-angular/compare/v1.6.3...v1.6.4) (2021-11-02)

### Features

-   **core:** feat(core): remove scroll-into-view-if-needed

### [1.6.3](https://github.com/worktile/slate-angular/compare/v1.6.2...v1.6.3) (2021-10-15)

### Bug Fixes

-   **core:** fix the IME input fails when text is selected

### [1.6.2](https://github.com/worktile/slate-angular/compare/v1.5.4...v1.6.2) (2021-10-13)

### Features

-   **plugin:** add deleteCutData function for cut

### [1.5.4](https://github.com/worktile/slate-angular/compare/v1.5.3...v1.5.4) (2021-10-11)

### Bug Fixes

-   **core:** fix(core): add editable-text on the span for leaf

### [1.5.3](https://github.com/worktile/slate-angular/compare/v1.5.2...v1.5.3) (2021-10-09)

### Bug Fixes

-   **core:** fix(core): correct render return value type

### [1.5.2](https://github.com/worktile/slate-angular/compare/v1.5.1...v1.5.2) (2021-09-30)

### Bug Fixes

-   **core:** fix(core): correct isComposing for collaboration #WIK-4870

### [1.5.1](https://github.com/worktile/slate-angular/compare/v1.5.0...v1.5.1) (2021-09-28)

### Bug Fixes

-   **view:** fix(view): modify the definition as directive

### [1.5.0](https://github.com/worktile/slate-angular/compare/v1.4.2...v1.5.0) (2021-09-27)

### Features

-   **core:** feat(core): bump angular to 12

### [1.4.2](https://github.com/worktile/slate-angular/compare/v1.4.1...v1.4.2) (2021-09-23)

### Bug Fixes

-   **core:** fix(core): remove selectionchange throttle to avoid selection out of sync

### [1.4.1](https://github.com/worktile/slate-angular/compare/v1.4.0...v1.4.1) (2021-09-18)

### Features

-   **decorate:** feat(decorate): support isStrictDecorate

### [1.4.0](https://github.com/worktile/slate-angular/compare/v1.4.0...v1.3.1) (2021-08-31)

### Bug Fixes

-   **core:** feat(core): contextChange not execute when readonly changes

### [1.3.1](https://github.com/worktile/slate-angular/compare/v1.3.1...v1.3.0) (2021-08-19)

### Features

-   **block-card:** feat(block-card): remove block card contenteditable false

### [1.3.0](https://github.com/worktile/slate-angular/compare/v1.3.0...v1.2.2) (2021-08-19)

### Bug Fixes

-   **global-normalize:** fix(global-normalize): fix selection is empty

### Features

-   **core:** feat(core): feat(core): add editable debug time

### [1.2.2](https://github.com/worktile/slate-angular/compare/v1.2.2...v1.2.1) (2021-08-06)

### Bug Fixes

-   **core:** fix(core): fix the dom selection is not converted correctly

### [1.2.1](https://github.com/worktile/slate-angular/compare/v1.2.1...v1.2.0) (2021-08-03)

### Bug Fixes

-   **core:** fix(core): fix cursor problem in shared editor

### [1.2.0](https://github.com/worktile/slate-angular/compare/v1.2.0...v1.1.9) (2021-07-20)

### Features

-   **core:** feat(core): dynamic handle readonly [#99](https://github.com/worktile/slate-angular/issues/99)

### [1.1.9](https://github.com/worktile/slate-angular/compare/v1.1.8...v1.1.9) (2021-07-16)

### Bug Fixes

-   **core:** fix(core): adjust leaf insert position
-   **core:** feat(global-normalize): add and apply global-normalize
-   **core:** fix(view): compat empty children render

### [1.1.8](https://github.com/worktile/slate-angular/compare/v1.1.7...v1.1.8) (2021-07-06)

### Bug Fixes

-   **core:** fix(core): remove call delete fragment when paste

### [1.1.7](https://github.com/worktile/slate-angular/compare/v1.1.4...v1.1.7) (2021-06-28)

### Bug Fixes

-   **block-card:** fix(block-card): fix block card update problem when enable ivy

### [1.1.4](https://github.com/worktile/slate-angular/compare/v1.1.3...v1.1.4) (2021-06-21)

### Bug Fixes

-   **config:** fix(config): fix peerDependencies
-   **core:** refactor(core): update keydown parameters
-   **core:** fix(core): fix fragment insert

### [1.1.3](https://github.com/worktile/slate-angular/compare/v1.1.1...v1.1.3) (2021-06-09)

### Features

-   **view:** refactor(view): refactor block-card logic and api

### Bug Fixes

-   **core:** fix(core): correct IS_FOCUSED status on block card
-   **core:** fix(core): add data-slate-leaf to BaseLeafComponent #WIK-4119

### [1.1.1](https://github.com/worktile/slate-angular/compare/v1.1.0...v1.1.1) (2021-06-02)

## [1.1.0](https://github.com/worktile/slate-angular/compare/v1.0.3...v1.1.0) (2021-06-02)

### Features

-   **plugin:** delete current line when deleting backward with line unit ([bc5e331](https://github.com/worktile/slate-angular/commit/bc5e33151817935e904bc81e7b67808863182a6e))
-   **view:** implementation for working with non-global window instances ([7b76474](https://github.com/worktile/slate-angular/commit/7b76474f9c1f7c89ec53edda9161fefe43f349c4))

### Bug Fixes

-   **browser:** disable spellCheck, autoCorrect, autoCapitalize when browser doesnt HAS_BEFORE_INPUT_SUPPORT ([5ab5677](https://github.com/worktile/slate-angular/commit/5ab56777d228092c763ee6a19d60ad97f9492b8e))
-   **browser:** editor auto-scrolling behavior when a block is bigger than the viewport ([ce0fb06](https://github.com/worktile/slate-angular/commit/ce0fb065ec89e5618cf0479da2c7468913249bdb))
-   **browser:** fix cursor movement in RTL elements ([098ea24](https://github.com/worktile/slate-angular/commit/098ea24ef485490777509f1297ebc2897765e51d))
-   **browser:** fix domSelection undefined ([ed0877d](https://github.com/worktile/slate-angular/commit/ed0877d66d3158a2897e19142716bbefc24b0254))
-   **browser:** fixes Slate to work with the Shadow DOM ([e8cf304](https://github.com/worktile/slate-angular/commit/e8cf3042ff1af93165280c5aee28c390e7faf23f))
-   **browser:** revert condition ([bc7c1da](https://github.com/worktile/slate-angular/commit/bc7c1daa52ddcd80f65e0ddb99699af03343e951))
-   **core:** angularEditor maintains independence ([a700300](https://github.com/worktile/slate-angular/commit/a7003009bc0817a42a5d20f31b5cc5127821eb08))
-   **core:** collapse expanded selection before handling `moveWordBackward` (`alt + left`) and `moveWordForward` (`alt + right`) hotkeys ([c281a74](https://github.com/worktile/slate-angular/commit/c281a746f62e060660e326199a575b8087f84bcc))
-   **core:** collapse selection according to reverse ([6dbfa60](https://github.com/worktile/slate-angular/commit/6dbfa6015186c3869e08ba24dce94b9c63f2b076))
-   **core:** cut will remove void element when only select void element ([1ec3923](https://github.com/worktile/slate-angular/commit/1ec3923d070c3ba1a57b8b1d285a8b23803394ca))
-   **core:** fix drag and drop logic ([#4238](https://github.com/worktile/slate-angular/issues/4238)) ([a9960ec](https://github.com/worktile/slate-angular/commit/a9960ecafcc6c9ac22cb63ec9880861599dc1844))
-   **core:** fix format ([3360bad](https://github.com/worktile/slate-angular/commit/3360badb37fb1f18fc8d4136827fcdc2e233f5b7))
-   **core:** fix normalizeDOMPoint to do better job ([#4048](https://github.com/worktile/slate-angular/issues/4048)) ([cfa0088](https://github.com/worktile/slate-angular/commit/cfa0088aec7610c4d78de0939afa78273d2a9fa2))
-   **core:** fixed an issue with controlled value messing up editor.selection ([e3b7a08](https://github.com/worktile/slate-angular/commit/e3b7a08fefdafa0b1492c9017aa7e865d9988842))
-   **core:** fixed converting querySelectorAll results to array ([ea58e3f](https://github.com/worktile/slate-angular/commit/ea58e3f1aaf61e3b6fb93c700258ab23c745db42))
-   **demo:** fix Type Error ([7d43290](https://github.com/worktile/slate-angular/commit/7d4329081f6196cf506aa8ee48ba94873d302f0d))
-   **types:** define ret type ([58b93ec](https://github.com/worktile/slate-angular/commit/58b93ecc68efbf7788f263f77b8fd5a2797e3e9f))

### [1.0.3](https://github.com/worktile/slate-angular/compare/v1.0.2...v1.0.3) (2021-05-27)

### Bug Fixes

-   **browser:** fix cursor move warn for qq browser ([ace5697](https://github.com/worktile/slate-angular/commit/ace56976672a5c0501209c5686f654c0541bce8c))

### [1.0.2](https://github.com/worktile/slate-angular/compare/v1.0.1...v1.0.2) (2021-05-27)

### Features

-   **demo:** add image demo #WIK-563 ([2beefb1](https://github.com/worktile/slate-angular/commit/2beefb1b647a17c221b25b91fbfaf43bad01321e)), closes [#WIK-563](https://github.com/worktile/slate-angular/issues/WIK-563)
-   **demo:** add search highlighting ([faa76e6](https://github.com/worktile/slate-angular/commit/faa76e61d3ded9e931cc99e294d6d11e7f1f8736))
-   **demo:** add table demo #WIK-697 ([925674b](https://github.com/worktile/slate-angular/commit/925674becef0581d418e954bd049b62777d99819)), closes [#WIK-697](https://github.com/worktile/slate-angular/issues/WIK-697)
-   **demo:** adjust demo style ([622b5a6](https://github.com/worktile/slate-angular/commit/622b5a6a8074948c9faaa88ac81207b53b867fa8))
-   **demo:** remove click ([6fdd599](https://github.com/worktile/slate-angular/commit/6fdd599cb6aab1d12b2a7c58babe9cc1935596fd))

### Bug Fixes

-   **demo:** fix change method ([135df58](https://github.com/worktile/slate-angular/commit/135df5847cf7d671ab7a2446fd83033e6569974a))
-   **view:** catch the invalid data range ([e6201d7](https://github.com/worktile/slate-angular/commit/e6201d7b3a7e1795606a1f39aa70e678673c618e))

### [1.0.1](https://github.com/worktile/slate-angular/compare/v1.0.0...v1.0.1) (2021-05-27)

### Features

-   **core:** add trackby and update README ([3fc5240](https://github.com/worktile/slate-angular/commit/3fc5240329dd8b5df368260e9c26ab83481ee192))

## [1.0.0](https://github.com/worktile/slate-angular/compare/v0.53.3...v1.0.0) (2021-05-27)

### Features

-   **view:** refactor angular view render ([40a636a](https://github.com/worktile/slate-angular/commit/40a636a7f9a86aa6a93fb583a787c6c67fd41fb7))

### Bug Fixes

-   **core:** avoid merge the empty text #WIK-3805 ([3206b1a](https://github.com/worktile/slate-angular/commit/3206b1a6b35d03a15c2e1e113c4d5681b0a5e335)), closes [#WIK-3805](https://github.com/worktile/slate-angular/issues/WIK-3805)

### [0.53.4](https://github.com/worktile/slate-angular/compare/v0.53.3...v0.53.4) (2021-05-27)

### Bug Fixes

-   **core:** avoid merge the empty text #WIK-3805 ([3206b1a](https://github.com/worktile/slate-angular/commit/3206b1a6b35d03a15c2e1e113c4d5681b0a5e335)), closes [#WIK-3805](https://github.com/worktile/slate-angular/issues/WIK-3805)

### [0.53.3](https://github.com/worktile/slate-angular/compare/v0.53.2...v0.53.3) (2021-04-22)

### Bug Fixes

-   **core:** fix throw error when selectionchange #WIK-3788 ([881b65a](https://github.com/worktile/slate-angular/commit/881b65ab5cb671dd8a1b28d321040b20f97cabda)), closes [#WIK-3788](https://github.com/worktile/slate-angular/issues/WIK-3788)
-   **core:** modify card-right offset to -2 ([143adad](https://github.com/worktile/slate-angular/commit/143adad48d2717fa30eb033f528d6d92cd953b97))

### [0.53.2](https://github.com/worktile/slate-angular/compare/v0.53.1...v0.53.2) (2021-04-22)

### Features

-   **core:** add logic to correct DOMSelection #WIK-3786 ([75cdb90](https://github.com/worktile/slate-angular/commit/75cdb90df74e8f2386546597edf22911eac643e1)), closes [#WIK-3786](https://github.com/worktile/slate-angular/issues/WIK-3786)

### Bug Fixes

-   **core:** call deleteFragment before paste to avoid invalid data #WIK-3784 ([24d4c25](https://github.com/worktile/slate-angular/commit/24d4c258d9af6333ea60b088a89e668d7978514e)), closes [#WIK-3784](https://github.com/worktile/slate-angular/issues/WIK-3784)
-   **plugin:** add isFocusedPath to ensure selection is on the text WIK-3762 ([#28](https://github.com/worktile/slate-angular/issues/28)) ([006d3f8](https://github.com/worktile/slate-angular/commit/006d3f89b99d17b2eef650bd63dfb856bf6e5bb2))

### [0.53.1](https://github.com/worktile/slate-angular/compare/v0.53.0...v0.53.1) (2021-04-21)

### Features

-   **core:** support custom clipboard format key #WIK-3782 ([3e8a832](https://github.com/worktile/slate-angular/commit/3e8a832a7c9247acd76cf4ebf35fa7573411b096)), closes [#WIK-3782](https://github.com/worktile/slate-angular/issues/WIK-3782)

### Bug Fixes

-   **block-card:** fix forward set path error #WIK-3779 ([2619ff5](https://github.com/worktile/slate-angular/commit/2619ff54a3626164333fd3d504b3392f072afb63)), closes [#WIK-3779](https://github.com/worktile/slate-angular/issues/WIK-3779)
-   **block-card:** fix get cursor error ([e6a2d61](https://github.com/worktile/slate-angular/commit/e6a2d61a98befd04df197f09b0e52b3b0a47707c))

## [0.53.0](https://github.com/worktile/slate-angular/compare/v0.52.0...v0.53.0) (2021-04-19)

### Bug Fixes

-   **core:** support the expand range for card-left/card-center/card-right ([953be38](https://github.com/worktile/slate-angular/commit/953be385e55e34cfad7ee4c15cc7b7a54a93025d))

## [0.52.0](https://github.com/worktile/slate-angular/compare/v0.51.0...v0.52.0) (2021-04-19)

### Features

-   **core:** suport slate selection for block card ([9c1591b](https://github.com/worktile/slate-angular/commit/9c1591b669bbc15a922534e3cc1babae9fec268d))

### Bug Fixes

-   **browser:** compat firefox fire twice composition end #WIK-3760 ([f377954](https://github.com/worktile/slate-angular/commit/f3779545d34239b9fadb7b076514a23169ba92c2)), closes [#WIK-3760](https://github.com/worktile/slate-angular/issues/WIK-3760)

### [0.51.1](https://github.com/worktile/slate-angular/compare/v0.51.0...v0.51.1) (2021-04-15)

### Bug Fixes

-   **browser:** compat firefox fire twice composition end #WIK-3760 ([f377954](https://github.com/worktile/slate-angular/commit/f3779545d34239b9fadb7b076514a23169ba92c2)), closes [#WIK-3760](https://github.com/worktile/slate-angular/issues/WIK-3760)

## [0.51.0](https://github.com/worktile/slate-angular/compare/v0.50.3...v0.51.0) (2021-04-13)

### Bug Fixes

-   **core:** refactor ng model and fix test error ([3ab7cc1](https://github.com/worktile/slate-angular/commit/3ab7cc108d08098fd4c68ec81a2b86131738dc5d))

### [0.50.3](https://github.com/worktile/slate-angular/compare/v0.50.2...v0.50.3) (2021-04-12)

### Bug Fixes

-   **core:** fix componentRef rootNodes ([9ee7466](https://github.com/worktile/slate-angular/commit/9ee746627293490f85a15bf2acbba67c5672cfd2))

### [0.50.2](https://github.com/worktile/slate-angular/compare/v0.50.1...v0.50.2) (2021-04-12)

### Bug Fixes

-   **core:** call onChangeCallback after reRender ([e156610](https://github.com/worktile/slate-angular/commit/e1566102eeebb3c4ce696f45351b287bf166570b))

### 0.50.1 (2021-04-12)

### Features

-   **config:** update config ([8712d51](https://github.com/worktile/slate-angular/commit/8712d5130c750b96a9766ffc642e717d2da9784f))
-   **core:** init slate-angular ([a141fd4](https://github.com/worktile/slate-angular/commit/a141fd49db51c45c27a1fe9c13eb2efeab65b5eb))
-   **core:** support rootNodes ([6021de3](https://github.com/worktile/slate-angular/commit/6021de369550b3c15822062ff55a68254622e4b2))

### Bug Fixes

-   **core:** fix format code bug #WIK-3715 ([74bd53b](https://github.com/worktile/slate-angular/commit/74bd53b5c7399adba315cd75e897abf1b43d84a4)), closes [#WIK-3715](https://github.com/worktile/slate-angular/issues/WIK-3715)
-   **core:** set empty paragraph when empty value #INFR-1790 ([6450e76](https://github.com/worktile/slate-angular/commit/6450e7609d3d2f4c333056850c18af87228b7cf8)), closes [#INFR-1790](https://github.com/worktile/slate-angular/issues/INFR-1790)
-   **template:** prevent selectionchange when IME between 'aa\n' and '\n' #WIK-3703 ([2e538c5](https://github.com/worktile/slate-angular/commit/2e538c5535d87a8022579a1ea6344181fe069ca3)), closes [#WIK-3703](https://github.com/worktile/slate-angular/issues/WIK-3703)
