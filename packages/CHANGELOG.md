# Changelog

## 20.2.3

### Patch Changes

- [`65e298b4af26224a5b18eb260021e12599f2a934`](https://github.com/worktile/slate-angular/commit/65e298b4af26224a5b18eb260021e12599f2a934) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - optimize measure height timing, but do not measure height all in viewport

- [`d1e608e9b784e5b7981354ddb6e8a05c2a76ae53`](https://github.com/worktile/slate-angular/commit/d1e608e9b784e5b7981354ddb6e8a05c2a76ae53) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support getRoughHeight to help plugin to get rough height by element data

## 20.2.2

### Patch Changes

- [`308600752ed1e51f93d0bc8ccb1ee4bd4a4e2124`](https://github.com/worktile/slate-angular/commit/308600752ed1e51f93d0bc8ccb1ee4bd4a4e2124) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - need to measure element height when diff is different and need remove on top in onChange scenario #WIK-19747

- [`007193bf9534c4482828a81c9ea459c6405d5f23`](https://github.com/worktile/slate-angular/commit/007193bf9534c4482828a81c9ea459c6405d5f23) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support update compatible string to fix the issue mentioned in #WIK-19720

## 20.2.1

### Patch Changes

- [#330](https://github.com/worktile/slate-angular/pull/330) [`8cb2380e1ef9a0ac3c17361a4610939719aa26df`](https://github.com/worktile/slate-angular/commit/8cb2380e1ef9a0ac3c17361a4610939719aa26df) Thanks [@Xwatson](https://github.com/Xwatson)! - collapsed content will not be rendered

- [`648b9370c1a199d7fe04aa0af5dc176fb6e6aa12`](https://github.com/worktile/slate-angular/commit/648b9370c1a199d7fe04aa0af5dc176fb6e6aa12) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - deselect selection if selection is in invisible range and add isSelectionInvisible method to ensure selection is not in invisible range

## 20.2.0

### Minor Changes

- [#323](https://github.com/worktile/slate-angular/pull/323) [`1d4d10e076a959f066b2a714e135a014bced6e84`](https://github.com/worktile/slate-angular/commit/1d4d10e076a959f066b2a714e135a014bced6e84) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - getRealHeight support both number and promise return type

  remeasureHeightByIndics changed to sync method and improve logs

- [#323](https://github.com/worktile/slate-angular/pull/323) [`ad5d46054849e07206f684b5d3089c75b9344176`](https://github.com/worktile/slate-angular/commit/ad5d46054849e07206f684b5d3089c75b9344176) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support isVisible in withAngular plugin

- [#323](https://github.com/worktile/slate-angular/pull/323) [`b1f881f6ec4dd80d92507274fd71f5d15ac6927b`](https://github.com/worktile/slate-angular/commit/b1f881f6ec4dd80d92507274fd71f5d15ac6927b) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support selection in visible range

- [#323](https://github.com/worktile/slate-angular/pull/323) [`1d2fbd5d224934354f347cd2316625c1096cecb6`](https://github.com/worktile/slate-angular/commit/1d2fbd5d224934354f347cd2316625c1096cecb6) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - set up virtual scrolling structure

- [`38fd8d689789745303c5754d13251993c0861bec`](https://github.com/worktile/slate-angular/commit/38fd8d689789745303c5754d13251993c0861bec) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - calculate business top

- [#327](https://github.com/worktile/slate-angular/pull/327) [`002de85da75610fd04131050ae5b8d1afda007fe`](https://github.com/worktile/slate-angular/commit/002de85da75610fd04131050ae5b8d1afda007fe) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fix top height when scroll to upward

- [#324](https://github.com/worktile/slate-angular/pull/324) [`2dab563329ae55c616e163c31d752f94bedbfb7b`](https://github.com/worktile/slate-angular/commit/2dab563329ae55c616e163c31d752f94bedbfb7b) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - prevent executing virtual scroll logic when the editor is not enabled virtual scroll

- [`69f12884cceb1f9dcb8dd5cedfe90fb6d80f3553`](https://github.com/worktile/slate-angular/commit/69f12884cceb1f9dcb8dd5cedfe90fb6d80f3553) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fix text flavour can not destroy issue

- [#323](https://github.com/worktile/slate-angular/pull/323) [`420fa649ca83acf8d0a79edb903744edc7a2cac8`](https://github.com/worktile/slate-angular/commit/420fa649ca83acf8d0a79edb903744edc7a2cac8) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - correct visible elements calculation logic

### Patch Changes

- [#323](https://github.com/worktile/slate-angular/pull/323) [`eba539977f3619388ae0fcd85b790355f18b6753`](https://github.com/worktile/slate-angular/commit/eba539977f3619388ae0fcd85b790355f18b6753) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - optimize virtual logs

- [`5d7e72d90b19a1b41a55d63652d96dfa5e9293d6`](https://github.com/worktile/slate-angular/commit/5d7e72d90b19a1b41a55d63652d96dfa5e9293d6) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - set isUpdatingSelection to false after updating selection(auto scroll condition)

- [#323](https://github.com/worktile/slate-angular/pull/323) [`214d60b456e58fdcb542e21cfaa58bb411722853`](https://github.com/worktile/slate-angular/commit/214d60b456e58fdcb542e21cfaa58bb411722853) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fix(virtual): fix scrolling lag

- [#323](https://github.com/worktile/slate-angular/pull/323) [`6963ec3e3d3cc1bfe3e87204804710a995a9750a`](https://github.com/worktile/slate-angular/commit/6963ec3e3d3cc1bfe3e87204804710a995a9750a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - optmize virtual logs，diff needs to determine whether it is consistent before and after

- [#323](https://github.com/worktile/slate-angular/pull/323) [`fbf8502bbc813bf62fec762fa506de2414b529a9`](https://github.com/worktile/slate-angular/commit/fbf8502bbc813bf62fec762fa506de2414b529a9) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - strategy for getting realHeight when scrolling

- [`065381d38766ec7bc87c6f0acab0f6ff6c7e152d`](https://github.com/worktile/slate-angular/commit/065381d38766ec7bc87c6f0acab0f6ff6c7e152d) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - remove business top when calculate view bottom

- [#323](https://github.com/worktile/slate-angular/pull/323) [`090f811c6221bd9954a01b17d0ebb7f68d57187a`](https://github.com/worktile/slate-angular/commit/090f811c6221bd9954a01b17d0ebb7f68d57187a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - calculate real height base on block card or native element

- [`27e86aa6dea15ffd894b7abdcc67f19bd82b133a`](https://github.com/worktile/slate-angular/commit/27e86aa6dea15ffd894b7abdcc67f19bd82b133a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - remove syncScrollTop logic in calculateVirtualViewport

  will trigger `selectionchange` event and clear editor's selection if syncScrollTop is called and selection is not in viewport

- [#325](https://github.com/worktile/slate-angular/pull/325) [`8476b5e2a4a9b69fe28a77af3af06a137e7d961b`](https://github.com/worktile/slate-angular/commit/8476b5e2a4a9b69fe28a77af3af06a137e7d961b) Thanks [@Xwatson](https://github.com/Xwatson)! - support scrolling to specified node key

- [#323](https://github.com/worktile/slate-angular/pull/323) [`0de41f9320417127641582a9a55a2a0ab453c6fb`](https://github.com/worktile/slate-angular/commit/0de41f9320417127641582a9a55a2a0ab453c6fb) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - move marginTop and marginBottom to getRealHeight

- [`5e3343d78dd9895f3c2b2c831710ccdf22b84b85`](https://github.com/worktile/slate-angular/commit/5e3343d78dd9895f3c2b2c831710ccdf22b84b85) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - adapt block card in calculateVirtualScrollSelection

- [#323](https://github.com/worktile/slate-angular/pull/323) [`8815ac622d2af7660271815e61167e78a1b88a0b`](https://github.com/worktile/slate-angular/commit/8815ac622d2af7660271815e61167e78a1b88a0b) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add element keys to measure height of wekmap

- [`3bbcdd528bcb3fdeaa9ca017d88a66ed7416a327`](https://github.com/worktile/slate-angular/commit/3bbcdd528bcb3fdeaa9ca017d88a66ed7416a327) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - will skip reset preRenderingHTMLElement style if it is not in children of viewport

- [`63bbb6cb28ef4d9223da2dd3289b89d4b492e87c`](https://github.com/worktile/slate-angular/commit/63bbb6cb28ef4d9223da2dd3289b89d4b492e87c) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add preRenderingCount to all listRender.update

- [#323](https://github.com/worktile/slate-angular/pull/323) [`07740c973d6949b82bb7f3134b6818b30567c098`](https://github.com/worktile/slate-angular/commit/07740c973d6949b82bb7f3134b6818b30567c098) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fix select in backward scenario and selection is null scenario

- [`8a34c45fdf4f3bafcec40c8550b2a94db797c7a0`](https://github.com/worktile/slate-angular/commit/8a34c45fdf4f3bafcec40c8550b2a94db797c7a0) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support auto scroll param on toNativeSelection and scroll to bottom when autoScroll is true and the selection is not in viewport

  add scrollContainer in virtualScrollConfig

- [`a4c81b91a2374946b8d00b83260c38f1b6320be6`](https://github.com/worktile/slate-angular/commit/a4c81b91a2374946b8d00b83260c38f1b6320be6) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add 100% width to pre rendering element

- [`534e38ab50a407b94329c049c2be29cbb9f6c312`](https://github.com/worktile/slate-angular/commit/534e38ab50a407b94329c049c2be29cbb9f6c312) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - revert string component

- [`45d074617ecc3c6c92d8baa18e2bd5f07bf75631`](https://github.com/worktile/slate-angular/commit/45d074617ecc3c6c92d8baa18e2bd5f07bf75631) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - rename virtual-scroll

- [`9a18c14222ea571fda12c1211770054467229fc0`](https://github.com/worktile/slate-angular/commit/9a18c14222ea571fda12c1211770054467229fc0) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - correct virtual top height when scroll and prevent current calculation of calculateVirtualViewport

- [`bc12559059d6d550f88789e72f2b545d0684d84a`](https://github.com/worktile/slate-angular/commit/bc12559059d6d550f88789e72f2b545d0684d84a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - remove tryMeasureInViewportChildrenHeights logic and revert the handle for needRemoveOnTop

- [#326](https://github.com/worktile/slate-angular/pull/326) [`fe441072669f235b2398e4691168bc5dd170d73a`](https://github.com/worktile/slate-angular/commit/fe441072669f235b2398e4691168bc5dd170d73a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support remeasure height only when element is changed or added

  extract updateListRenderAndRemeasureHeights to update dom and remeasure heights and apply it to force to fix height can not be updated on Chinese composition type

  rename refreshVirtualViewAnimId to tryUpdateVirtualViewportAnimId, measureVisibleHeightsAnimId to tryMeasureInViewportChildrenHeightsAnimId, scheduleMeasureVisibleHeights to tryMeasureInViewportChildrenHeights

- [#323](https://github.com/worktile/slate-angular/pull/323) [`6c3ca7df39a1812a6d686cbd42cb66fed4c69a3f`](https://github.com/worktile/slate-angular/commit/6c3ca7df39a1812a6d686cbd42cb66fed4c69a3f) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support remeasure heights on data change

- [`eddf9b105b27ff8f866f7f721e10ce2256e9dcd7`](https://github.com/worktile/slate-angular/commit/eddf9b105b27ff8f866f7f721e10ce2256e9dcd7) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add `position: relative;` style to ensure pre rendering element's width is same as other elements

  if pre rendering element does not have correct width(such as table in theia), it will cause style issue

- [`af78203052b125e13ae5ab15e2e98d6628dafe62`](https://github.com/worktile/slate-angular/commit/af78203052b125e13ae5ab15e2e98d6628dafe62) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - refactor Set struct to Array struct

- [#323](https://github.com/worktile/slate-angular/pull/323) [`bdfe3884613772b94a6883703820134ccea6ea46`](https://github.com/worktile/slate-angular/commit/bdfe3884613772b94a6883703820134ccea6ea46) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fix first loading issue

- [`8b2d8a4cf48e2e0b03292a214685390287b4fd33`](https://github.com/worktile/slate-angular/commit/8b2d8a4cf48e2e0b03292a214685390287b4fd33) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support pre-rendering on bottom elements to ensure the DOM is steady when the element is in viewport

- [`b15e496268e86c5be3991f82f10adacf5b730a08`](https://github.com/worktile/slate-angular/commit/b15e496268e86c5be3991f82f10adacf5b730a08) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support EDITOR_TO_VIRTUAL_SCROLL_SELECTION to get virtual scroll selection from everywhere

  extract calculateVirtualScrollSelection as individual function

- [#328](https://github.com/worktile/slate-angular/pull/328) [`5bb1f28b9966859e23f852a2f0fab4c2d76ae54a`](https://github.com/worktile/slate-angular/commit/5bb1f28b9966859e23f852a2f0fab4c2d76ae54a) Thanks [@Xwatson](https://github.com/Xwatson)! - Change the container width change clearing to height
  - This operation is to prevent the problem of inconsistent height calculation caches under containers of different widths.
  - If not cleared, the cache heights under different containers will be mixed, leading to errors in rendering calculations.

- [`4aaa3a9d7096788e36085a9c95d35f1243e6d1fb`](https://github.com/worktile/slate-angular/commit/4aaa3a9d7096788e36085a9c95d35f1243e6d1fb) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fix throw error when destroy element which hadn't been initialized

- [`6469b4b83f06cc90e4f14d34240153ae6c5bb5f8`](https://github.com/worktile/slate-angular/commit/6469b4b83f06cc90e4f14d34240153ae6c5bb5f8) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - set left and right to keep the width of pre-rendering element is the same as the width of normal element

- [#323](https://github.com/worktile/slate-angular/pull/323) [`aaa26b8de83b515d69c50c467621cbada1b0c175`](https://github.com/worktile/slate-angular/commit/aaa26b8de83b515d69c50c467621cbada1b0c175) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - use getBoundingClientRect to get height

- [`4cc21d4281d578c44064157d2a000b1a8f987dab`](https://github.com/worktile/slate-angular/commit/4cc21d4281d578c44064157d2a000b1a8f987dab) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - cache root node width and set pre-rendering width

- [`780c2e4e36ecc9cbb73f7429fc148b013972c28a`](https://github.com/worktile/slate-angular/commit/780c2e4e36ecc9cbb73f7429fc148b013972c28a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - rename visible to inViewport

- [`f996fd40828ebd6e84482f0e980b06cb37bf3b44`](https://github.com/worktile/slate-angular/commit/f996fd40828ebd6e84482f0e980b06cb37bf3b44) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add virtual-scroll utils

- [#323](https://github.com/worktile/slate-angular/pull/323) [`dacfaf13375a9f90b92f16eef1299d9e58423ea1`](https://github.com/worktile/slate-angular/commit/dacfaf13375a9f90b92f16eef1299d9e58423ea1) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - 1. Add top and bottom virtual height elements 2. Add JUST_NOW_UPDATED_VIRTUAL_VIEW to avoid circle trigger virtual scrolling

- [`9ca040bda59a793c5b1cd2e0d59d1286d755b824`](https://github.com/worktile/slate-angular/commit/9ca040bda59a793c5b1cd2e0d59d1286d755b824) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add debugLog and move debugLog to virtual-scroll

- [#323](https://github.com/worktile/slate-angular/pull/323) [`30e6d98cfe51fbdd18ae8f5f012aa2a15ac4d604`](https://github.com/worktile/slate-angular/commit/30e6d98cfe51fbdd18ae8f5f012aa2a15ac4d604) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - diff scrolling optimization, adding logs

- [#323](https://github.com/worktile/slate-angular/pull/323) [`9541127a237f036430c006382d7f8ae175b75c3a`](https://github.com/worktile/slate-angular/commit/9541127a237f036430c006382d7f8ae175b75c3a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fix(virtual): width change remeasurement height, add debug overlay

- [`dcb48f9a6de33ecf38d181d70f1ae71ad29def9f`](https://github.com/worktile/slate-angular/commit/dcb48f9a6de33ecf38d181d70f1ae71ad29def9f) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fix min-height was reset issue

- [#329](https://github.com/worktile/slate-angular/pull/329) [`bb32aedcc541406ae7c527d4c052e7e208d3574f`](https://github.com/worktile/slate-angular/commit/bb32aedcc541406ae7c527d4c052e7e208d3574f) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support pre render top elements

- [#323](https://github.com/worktile/slate-angular/pull/323) [`c25ff0fe5d6abebd06e467b09265f41fae493612`](https://github.com/worktile/slate-angular/commit/c25ff0fe5d6abebd06e467b09265f41fae493612) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - get measured height strengthen the judgment of numeric types

- [#323](https://github.com/worktile/slate-angular/pull/323) [`0dad72647fc70532ac3aae08df2a221ee86a6b22`](https://github.com/worktile/slate-angular/commit/0dad72647fc70532ac3aae08df2a221ee86a6b22) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - there is a blank space below the scroll when the page switches to widescreen

- [`8f04cfdb150d6f7aa35c58c99520537315c73b2a`](https://github.com/worktile/slate-angular/commit/8f04cfdb150d6f7aa35c58c99520537315c73b2a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support isEnabledVirtualScroll status

- [`1f7365ce813afbd3b8fcaf469af5a2e9d445f11e`](https://github.com/worktile/slate-angular/commit/1f7365ce813afbd3b8fcaf469af5a2e9d445f11e) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support custom leaf component outlet parent

## 20.2.0-next.35

### Patch Changes

- [`5d7e72d90b19a1b41a55d63652d96dfa5e9293d6`](https://github.com/worktile/slate-angular/commit/5d7e72d90b19a1b41a55d63652d96dfa5e9293d6) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - set isUpdatingSelection to false after updating selection(auto scroll condition)

## 20.2.0-next.34

### Patch Changes

- [`3bbcdd528bcb3fdeaa9ca017d88a66ed7416a327`](https://github.com/worktile/slate-angular/commit/3bbcdd528bcb3fdeaa9ca017d88a66ed7416a327) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - will skip reset preRenderingHTMLElement style if it is not in children of viewport

## 20.2.0-next.33

### Patch Changes

- [`4cc21d4281d578c44064157d2a000b1a8f987dab`](https://github.com/worktile/slate-angular/commit/4cc21d4281d578c44064157d2a000b1a8f987dab) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - cache root node width and set pre-rendering width

## 20.2.0-next.32

### Patch Changes

- [`6469b4b83f06cc90e4f14d34240153ae6c5bb5f8`](https://github.com/worktile/slate-angular/commit/6469b4b83f06cc90e4f14d34240153ae6c5bb5f8) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - set left and right to keep the width of pre-rendering element is the same as the width of normal element

## 20.2.0-next.31

### Patch Changes

- [`a4c81b91a2374946b8d00b83260c38f1b6320be6`](https://github.com/worktile/slate-angular/commit/a4c81b91a2374946b8d00b83260c38f1b6320be6) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add 100% width to pre rendering element

- [`780c2e4e36ecc9cbb73f7429fc148b013972c28a`](https://github.com/worktile/slate-angular/commit/780c2e4e36ecc9cbb73f7429fc148b013972c28a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - rename visible to inViewport

## 20.2.0-next.30

### Patch Changes

- [`27e86aa6dea15ffd894b7abdcc67f19bd82b133a`](https://github.com/worktile/slate-angular/commit/27e86aa6dea15ffd894b7abdcc67f19bd82b133a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - remove syncScrollTop logic in calculateVirtualViewport

  will trigger `selectionchange` event and clear editor's selection if syncScrollTop is called and selection is not in viewport

- [`9a18c14222ea571fda12c1211770054467229fc0`](https://github.com/worktile/slate-angular/commit/9a18c14222ea571fda12c1211770054467229fc0) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - correct virtual top height when scroll and prevent current calculation of calculateVirtualViewport

## 20.2.0-next.29

### Patch Changes

- [`eddf9b105b27ff8f866f7f721e10ce2256e9dcd7`](https://github.com/worktile/slate-angular/commit/eddf9b105b27ff8f866f7f721e10ce2256e9dcd7) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add `position: relative;` style to ensure pre rendering element's width is same as other elements

  if pre rendering element does not have correct width(such as table in theia), it will cause style issue

## 20.2.0-next.28

### Patch Changes

- [`5e3343d78dd9895f3c2b2c831710ccdf22b84b85`](https://github.com/worktile/slate-angular/commit/5e3343d78dd9895f3c2b2c831710ccdf22b84b85) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - adapt block card in calculateVirtualScrollSelection

- [`8a34c45fdf4f3bafcec40c8550b2a94db797c7a0`](https://github.com/worktile/slate-angular/commit/8a34c45fdf4f3bafcec40c8550b2a94db797c7a0) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support auto scroll param on toNativeSelection and scroll to bottom when autoScroll is true and the selection is not in viewport

  add scrollContainer in virtualScrollConfig

## 20.2.0-next.27

### Patch Changes

- [`9ca040bda59a793c5b1cd2e0d59d1286d755b824`](https://github.com/worktile/slate-angular/commit/9ca040bda59a793c5b1cd2e0d59d1286d755b824) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add debugLog and move debugLog to virtual-scroll

- [`dcb48f9a6de33ecf38d181d70f1ae71ad29def9f`](https://github.com/worktile/slate-angular/commit/dcb48f9a6de33ecf38d181d70f1ae71ad29def9f) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fix min-height was reset issue

## 20.2.0-next.26

### Patch Changes

- [`bc12559059d6d550f88789e72f2b545d0684d84a`](https://github.com/worktile/slate-angular/commit/bc12559059d6d550f88789e72f2b545d0684d84a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - remove tryMeasureInViewportChildrenHeights logic and revert the handle for needRemoveOnTop

## 20.2.0-next.25

### Patch Changes

- [`8b2d8a4cf48e2e0b03292a214685390287b4fd33`](https://github.com/worktile/slate-angular/commit/8b2d8a4cf48e2e0b03292a214685390287b4fd33) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support pre-rendering on bottom elements to ensure the DOM is steady when the element is in viewport

## 20.2.0-next.24

### Patch Changes

- [`63bbb6cb28ef4d9223da2dd3289b89d4b492e87c`](https://github.com/worktile/slate-angular/commit/63bbb6cb28ef4d9223da2dd3289b89d4b492e87c) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add preRenderingCount to all listRender.update

- [`af78203052b125e13ae5ab15e2e98d6628dafe62`](https://github.com/worktile/slate-angular/commit/af78203052b125e13ae5ab15e2e98d6628dafe62) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - refactor Set struct to Array struct

- [#329](https://github.com/worktile/slate-angular/pull/329) [`bb32aedcc541406ae7c527d4c052e7e208d3574f`](https://github.com/worktile/slate-angular/commit/bb32aedcc541406ae7c527d4c052e7e208d3574f) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support pre render top elements

## 20.2.0-next.23

### Patch Changes

- [`534e38ab50a407b94329c049c2be29cbb9f6c312`](https://github.com/worktile/slate-angular/commit/534e38ab50a407b94329c049c2be29cbb9f6c312) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - revert string component

## 20.2.0-next.22

### Patch Changes

- [`065381d38766ec7bc87c6f0acab0f6ff6c7e152d`](https://github.com/worktile/slate-angular/commit/065381d38766ec7bc87c6f0acab0f6ff6c7e152d) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - remove business top when calculate view bottom

- [#328](https://github.com/worktile/slate-angular/pull/328) [`5bb1f28b9966859e23f852a2f0fab4c2d76ae54a`](https://github.com/worktile/slate-angular/commit/5bb1f28b9966859e23f852a2f0fab4c2d76ae54a) Thanks [@Xwatson](https://github.com/Xwatson)! - Change the container width change clearing to height
  - This operation is to prevent the problem of inconsistent height calculation caches under containers of different widths.
  - If not cleared, the cache heights under different containers will be mixed, leading to errors in rendering calculations.

- [`1f7365ce813afbd3b8fcaf469af5a2e9d445f11e`](https://github.com/worktile/slate-angular/commit/1f7365ce813afbd3b8fcaf469af5a2e9d445f11e) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support custom leaf component outlet parent

## 20.2.0-next.21

### Minor Changes

- [#327](https://github.com/worktile/slate-angular/pull/327) [`002de85da75610fd04131050ae5b8d1afda007fe`](https://github.com/worktile/slate-angular/commit/002de85da75610fd04131050ae5b8d1afda007fe) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fix top height when scroll to upward

## 20.2.0-next.20

### Minor Changes

- [`38fd8d689789745303c5754d13251993c0861bec`](https://github.com/worktile/slate-angular/commit/38fd8d689789745303c5754d13251993c0861bec) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - calculate business top

## 20.2.0-next.19

### Patch Changes

- [#325](https://github.com/worktile/slate-angular/pull/325) [`8476b5e2a4a9b69fe28a77af3af06a137e7d961b`](https://github.com/worktile/slate-angular/commit/8476b5e2a4a9b69fe28a77af3af06a137e7d961b) Thanks [@Xwatson](https://github.com/Xwatson)! - support scrolling to element

## 20.2.0-next.18

### Patch Changes

- [#326](https://github.com/worktile/slate-angular/pull/326) [`fe441072669f235b2398e4691168bc5dd170d73a`](https://github.com/worktile/slate-angular/commit/fe441072669f235b2398e4691168bc5dd170d73a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support remeasure height only when element is changed or added

  extract updateListRenderAndRemeasureHeights to update dom and remeasure heights and apply it to force to fix height can not be updated on Chinese composition type

  rename refreshVirtualViewAnimId to tryUpdateVirtualViewportAnimId, measureVisibleHeightsAnimId to tryMeasureInViewportChildrenHeightsAnimId, scheduleMeasureVisibleHeights to tryMeasureInViewportChildrenHeights

- [`f996fd40828ebd6e84482f0e980b06cb37bf3b44`](https://github.com/worktile/slate-angular/commit/f996fd40828ebd6e84482f0e980b06cb37bf3b44) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add virtual-scroll utils

## 20.2.0-next.17

### Patch Changes

- [`b15e496268e86c5be3991f82f10adacf5b730a08`](https://github.com/worktile/slate-angular/commit/b15e496268e86c5be3991f82f10adacf5b730a08) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support EDITOR_TO_VIRTUAL_SCROLL_SELECTION to get virtual scroll selection from everywhere

  extract calculateVirtualScrollSelection as individual function

## 20.2.0-next.16

### Patch Changes

- [`4aaa3a9d7096788e36085a9c95d35f1243e6d1fb`](https://github.com/worktile/slate-angular/commit/4aaa3a9d7096788e36085a9c95d35f1243e6d1fb) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fix throw error when destroy element which hadn't been initialized

## 20.2.0-next.15

### Patch Changes

- [`8f04cfdb150d6f7aa35c58c99520537315c73b2a`](https://github.com/worktile/slate-angular/commit/8f04cfdb150d6f7aa35c58c99520537315c73b2a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support isEnabledVirtualScroll status

## 20.2.0-next.14

### Minor Changes

- [#324](https://github.com/worktile/slate-angular/pull/324) [`2dab563329ae55c616e163c31d752f94bedbfb7b`](https://github.com/worktile/slate-angular/commit/2dab563329ae55c616e163c31d752f94bedbfb7b) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - prevent executing virtual scroll logic when the editor is not enabled virtual scroll

- [`69f12884cceb1f9dcb8dd5cedfe90fb6d80f3553`](https://github.com/worktile/slate-angular/commit/69f12884cceb1f9dcb8dd5cedfe90fb6d80f3553) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fix text flavour can not destroy issue

## 20.2.0-next.13

### Patch Changes

- [`45d074617ecc3c6c92d8baa18e2bd5f07bf75631`](https://github.com/worktile/slate-angular/commit/45d074617ecc3c6c92d8baa18e2bd5f07bf75631) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - rename virtual-scroll

## 20.2.0-next.12

### Minor Changes

- [#322](https://github.com/worktile/slate-angular/pull/322) [`10c92779d08e7393613489485b2c351d3f21ad78`](https://github.com/worktile/slate-angular/commit/10c92779d08e7393613489485b2c351d3f21ad78) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support isVisible in withAngular plugin

### Patch Changes

- [#321](https://github.com/worktile/slate-angular/pull/321) [`b16260d0dd8ac7419b05f93552f89229777b1868`](https://github.com/worktile/slate-angular/commit/b16260d0dd8ac7419b05f93552f89229777b1868) Thanks [@Xwatson](https://github.com/Xwatson)! - get measured height strengthen the judgment of numeric types

## 20.2.0-next.11

### Patch Changes

- [`ced6f27212eba20fb0f39fdee8d309fdc9189594`](https://github.com/worktile/slate-angular/commit/ced6f27212eba20fb0f39fdee8d309fdc9189594) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fix first loading issue

## 20.2.0-next.10

### Patch Changes

- [#319](https://github.com/worktile/slate-angular/pull/319) [`4165f855b4fe959aaa337ead5f4dd759853eb5ba`](https://github.com/worktile/slate-angular/commit/4165f855b4fe959aaa337ead5f4dd759853eb5ba) Thanks [@Xwatson](https://github.com/Xwatson)! - add element keys to measure height of wekmap

- [#318](https://github.com/worktile/slate-angular/pull/318) [`d4a3d4942007de7ca0aee1c26e95547782ccca7f`](https://github.com/worktile/slate-angular/commit/d4a3d4942007de7ca0aee1c26e95547782ccca7f) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support remeasure heights on data change

## 20.2.0-next.9

### Patch Changes

- [#317](https://github.com/worktile/slate-angular/pull/317) [`89b6fb8aaf0664dc314c8863a8b434f8c2c154a1`](https://github.com/worktile/slate-angular/commit/89b6fb8aaf0664dc314c8863a8b434f8c2c154a1) Thanks [@Xwatson](https://github.com/Xwatson)! - fix(virtual): width change remeasurement height, add debug overlay

## 20.2.0-next.8

### Patch Changes

- [#316](https://github.com/worktile/slate-angular/pull/316) [`54bd3f7fbb0f9833d36307bee1acf0106976c15e`](https://github.com/worktile/slate-angular/commit/54bd3f7fbb0f9833d36307bee1acf0106976c15e) Thanks [@Xwatson](https://github.com/Xwatson)! - there is a blank space below the scroll when the page switches to widescreen

## 20.2.0-next.7

### Patch Changes

- [`89515431be9f573cd13cf6b1b65bc1b96b8ecb5e`](https://github.com/worktile/slate-angular/commit/89515431be9f573cd13cf6b1b65bc1b96b8ecb5e) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fix select in backward scenario and selection is null scenario

## 20.2.0-next.6

### Minor Changes

- [#315](https://github.com/worktile/slate-angular/pull/315) [`70c36a10a412b6440d9cb8a4bfc7b04a3d5d463c`](https://github.com/worktile/slate-angular/commit/70c36a10a412b6440d9cb8a4bfc7b04a3d5d463c) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support selection in visible range

### Patch Changes

- [#313](https://github.com/worktile/slate-angular/pull/313) [`93b000cf79a5f6fcfad1bbe69e3400f98dabc8a6`](https://github.com/worktile/slate-angular/commit/93b000cf79a5f6fcfad1bbe69e3400f98dabc8a6) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - use getBoundingClientRect to get height

## 20.2.0-next.5

### Patch Changes

- [#312](https://github.com/worktile/slate-angular/pull/312) [`c3d33101f64c111f3d546043061270041a694b6d`](https://github.com/worktile/slate-angular/commit/c3d33101f64c111f3d546043061270041a694b6d) Thanks [@Xwatson](https://github.com/Xwatson)! - fix(virtual): fix scrolling lag

## 20.2.0-next.4

### Minor Changes

- [#311](https://github.com/worktile/slate-angular/pull/311) [`023de1b987c48c0f98c182e35c27de19bbb812a8`](https://github.com/worktile/slate-angular/commit/023de1b987c48c0f98c182e35c27de19bbb812a8) Thanks [@Xwatson](https://github.com/Xwatson)! - correct visible elements calculation logic

## 20.2.0-next.3

### Minor Changes

- [`047f85cf63d0cd44801285fb8be33cc1c3856e3e`](https://github.com/worktile/slate-angular/commit/047f85cf63d0cd44801285fb8be33cc1c3856e3e) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - getRealHeight support both number and promise return type

  remeasureHeightByIndics changed to sync method and improve logs

## 20.2.0-next.2

### Patch Changes

- [#309](https://github.com/worktile/slate-angular/pull/309) [`2e17f3f2271233a7518971d5a1afc3a4c2aee518`](https://github.com/worktile/slate-angular/commit/2e17f3f2271233a7518971d5a1afc3a4c2aee518) Thanks [@Xwatson](https://github.com/Xwatson)! - optimize virtual logs

- [#310](https://github.com/worktile/slate-angular/pull/310) [`2a4898a72b7fc4a22be15a861939c67b15ffd1dd`](https://github.com/worktile/slate-angular/commit/2a4898a72b7fc4a22be15a861939c67b15ffd1dd) Thanks [@Xwatson](https://github.com/Xwatson)! - strategy for getting realHeight when scrolling

## 20.2.0-next.1

### Patch Changes

- [#308](https://github.com/worktile/slate-angular/pull/308) [`9d24380d946194d26f4d243f4797cf25941d9fe6`](https://github.com/worktile/slate-angular/commit/9d24380d946194d26f4d243f4797cf25941d9fe6) Thanks [@Xwatson](https://github.com/Xwatson)! - optmize virtual logs，diff needs to determine whether it is consistent before and after

- [`7a3cb26b48bd73efaa66734daa2cc4177b19321f`](https://github.com/worktile/slate-angular/commit/7a3cb26b48bd73efaa66734daa2cc4177b19321f) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - calculate real height base on block card or native element

- [`f8c24b2a5142688050ca67c943590629553dd41d`](https://github.com/worktile/slate-angular/commit/f8c24b2a5142688050ca67c943590629553dd41d) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - move marginTop and marginBottom to getRealHeight

- [#306](https://github.com/worktile/slate-angular/pull/306) [`6e1d3198902648336cb0a5c4299e887dec032b90`](https://github.com/worktile/slate-angular/commit/6e1d3198902648336cb0a5c4299e887dec032b90) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - 1. Add top and bottom virtual height elements 2. Add JUST_NOW_UPDATED_VIRTUAL_VIEW to avoid circle trigger virtual scrolling

- [#307](https://github.com/worktile/slate-angular/pull/307) [`41a85bfdd5efeed3670f6a81bc7d82511cce6afc`](https://github.com/worktile/slate-angular/commit/41a85bfdd5efeed3670f6a81bc7d82511cce6afc) Thanks [@Xwatson](https://github.com/Xwatson)! - diff scrolling optimization, adding logs

## 20.2.0-next.0

### Minor Changes

- [#305](https://github.com/worktile/slate-angular/pull/305) Thanks [@pubuzhixing8](https://github.com/Xwatson), [@Xwatson](https://github.com/Xwatson)! - set up virtual scrolling structure

## 20.1.0

### Minor Changes

- [`f81b50b8d9a1749171c010b06c9945bd6a936b2e`](https://github.com/worktile/slate-angular/commit/f81b50b8d9a1749171c010b06c9945bd6a936b2e) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - implement block card by dom

- [`62c3e9d745326bc98c9c8fdade4d25d7afabd0b9`](https://github.com/worktile/slate-angular/commit/62c3e9d745326bc98c9c8fdade4d25d7afabd0b9) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - remove slateDefaultElement, slateElement, SlateElement

## 20.0.0

### Major Changes

- [#302](https://github.com/worktile/slate-angular/pull/302) [`f9a8edde606de908c8edf72d3b842da8f8337ba5`](https://github.com/worktile/slate-angular/commit/f9a8edde606de908c8edf72d3b842da8f8337ba5) Thanks [@wangyuan-ky](https://github.com/wangyuan-ky)! - upgrade angular v20

### Minor Changes

- [#300](https://github.com/worktile/slate-angular/pull/300) [`7959412ee1b08bc75ffa45dedb9f19847080f174`](https://github.com/worktile/slate-angular/commit/7959412ee1b08bc75ffa45dedb9f19847080f174) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support flavour view(based native dom) to improve performance

### Patch Changes

- [#301](https://github.com/worktile/slate-angular/pull/301) [`a54438dec2351abcc87f60c4a0569338f77c56aa`](https://github.com/worktile/slate-angular/commit/a54438dec2351abcc87f60c4a0569338f77c56aa) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support contextClipboardData param on customInsertFragmentData

## 20.0.0-next.2

### Major Changes

- [#302](https://github.com/worktile/slate-angular/pull/302) [`f9a8edde606de908c8edf72d3b842da8f8337ba5`](https://github.com/worktile/slate-angular/commit/f9a8edde606de908c8edf72d3b842da8f8337ba5) Thanks [@wangyuan-ky](https://github.com/wangyuan-ky)! - upgrade angular v20

## 19.4.0-next.1

### Patch Changes

- [#301](https://github.com/worktile/slate-angular/pull/301) [`a54438dec2351abcc87f60c4a0569338f77c56aa`](https://github.com/worktile/slate-angular/commit/a54438dec2351abcc87f60c4a0569338f77c56aa) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support contextClipboardData param on customInsertFragmentData

## 19.4.0-next.0

### Minor Changes

- [#300](https://github.com/worktile/slate-angular/pull/300) [`7959412ee1b08bc75ffa45dedb9f19847080f174`](https://github.com/worktile/slate-angular/commit/7959412ee1b08bc75ffa45dedb9f19847080f174) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support flavour view(based native dom) to improve performance

## 19.3.1

### Patch Changes

- [`36917c9978fa1253f87e73d7e186f163060b48bd`](https://github.com/worktile/slate-angular/commit/36917c9978fa1253f87e73d7e186f163060b48bd) Thanks [@Xwatson](https://github.com/Xwatson)! - The processing does not obtain the height of the element, and it is omitted if it exceeds 1 line #WIK-19235

## 19.3.0

### Minor Changes

- [#297](https://github.com/worktile/slate-angular/pull/297) [`e6e2c91f37d2cfd4fd43f52eb87b3c5a2f2de568`](https://github.com/worktile/slate-angular/commit/e6e2c91f37d2cfd4fd43f52eb87b3c5a2f2de568) Thanks [@Xwatson](https://github.com/Xwatson)! - support webkitLineClamp for placeholder

## 19.2.0

### Minor Changes

- [#296](https://github.com/worktile/slate-angular/pull/296) [`d61f986117c2270ab54b6e1423d3b092b8ce6b65`](https://github.com/worktile/slate-angular/commit/d61f986117c2270ab54b6e1423d3b092b8ce6b65) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support fallback when copy from press button

## 19.1.2

### Patch Changes

- [#294](https://github.com/worktile/slate-angular/pull/294) [`e9bbf56c6af19588eb5f1a4a2ad74b7d2f49b89d`](https://github.com/worktile/slate-angular/commit/e9bbf56c6af19588eb5f1a4a2ad74b7d2f49b89d) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fix scrolling issue when cursor

## 19.1.1

### Patch Changes

- [`0da9ea88ff654dada7f97d01a68fbf1f0118a030`](https://github.com/worktile/slate-angular/commit/0da9ea88ff654dada7f97d01a68fbf1f0118a030) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - revert focus method

## 19.1.0

### Minor Changes

- [#290](https://github.com/worktile/slate-angular/pull/290) [`cd74f37c00e6782eb91a50c73901e6de73c055d0`](https://github.com/worktile/slate-angular/commit/cd74f37c00e6782eb91a50c73901e6de73c055d0) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - bump slate into 0.112.0 and import slate-dom@0.111.0

### Patch Changes

- [#291](https://github.com/worktile/slate-angular/pull/291) [`8dc087be989512c5de08e180cc572b5c867c75d4`](https://github.com/worktile/slate-angular/commit/8dc087be989512c5de08e180cc572b5c867c75d4) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - bump slate into 0.117.2, slate-dom into 0.114.0, slate-history into 0.113.1

- [`a03a740ada7854ac82b23796931d9de73d918db4`](https://github.com/worktile/slate-angular/commit/a03a740ada7854ac82b23796931d9de73d918db4) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fix context can not be replaced warning

- [#292](https://github.com/worktile/slate-angular/pull/292) [`ad27683513dd41fb685756feb71a13a2bde4a93f`](https://github.com/worktile/slate-angular/commit/ad27683513dd41fb685756feb71a13a2bde4a93f) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - revert focus logic and remove retry and setTimeout

- [`c680f61bd13bc58f7d6fc482ab107e261918b369`](https://github.com/worktile/slate-angular/commit/c680f61bd13bc58f7d6fc482ab107e261918b369) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fixed slate and slate-dom version

## 19.1.0-next.4

### Patch Changes

- [#292](https://github.com/worktile/slate-angular/pull/292) [`ad27683513dd41fb685756feb71a13a2bde4a93f`](https://github.com/worktile/slate-angular/commit/ad27683513dd41fb685756feb71a13a2bde4a93f) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - revert focus logic and remove retry and setTimeout

## 19.1.0-next.3

### Patch Changes

- [`a03a740ada7854ac82b23796931d9de73d918db4`](https://github.com/worktile/slate-angular/commit/a03a740ada7854ac82b23796931d9de73d918db4) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fix context can not be replaced warning

## 19.1.0-next.2

### Patch Changes

- [#291](https://github.com/worktile/slate-angular/pull/291) [`8dc087be989512c5de08e180cc572b5c867c75d4`](https://github.com/worktile/slate-angular/commit/8dc087be989512c5de08e180cc572b5c867c75d4) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - bump slate into 0.117.2, slate-dom into 0.114.0, slate-history into 0.113.1

## 19.1.0-next.1

### Patch Changes

- [`c680f61bd13bc58f7d6fc482ab107e261918b369`](https://github.com/worktile/slate-angular/commit/c680f61bd13bc58f7d6fc482ab107e261918b369) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fixed slate and slate-dom version

## 19.1.0-next.0

### Minor Changes

- [#290](https://github.com/worktile/slate-angular/pull/290) [`cd74f37c00e6782eb91a50c73901e6de73c055d0`](https://github.com/worktile/slate-angular/commit/cd74f37c00e6782eb91a50c73901e6de73c055d0) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - bump slate into 0.112.0 and import slate-dom@0.111.0

## 19.0.0

### Major Changes

- [#289](https://github.com/worktile/slate-angular/pull/289) [`5b50350cefb557e33be3b62e2e17ffd4d1a49bf0`](https://github.com/worktile/slate-angular/commit/5b50350cefb557e33be3b62e2e17ffd4d1a49bf0) Thanks [@minlovehua](https://github.com/minlovehua)! - bump angular into v19

- [#289](https://github.com/worktile/slate-angular/pull/289) [`d547dedb59887d3a00e5091375994c448c81ce9d`](https://github.com/worktile/slate-angular/commit/d547dedb59887d3a00e5091375994c448c81ce9d) Thanks [@minlovehua](https://github.com/minlovehua)! - build: upgrade angular to v19

## 19.0.0-next.0

### Major Changes

- [`df2a352c8e773cacf730b342530ab576847ec8db`](https://github.com/worktile/slate-angular/commit/df2a352c8e773cacf730b342530ab576847ec8db) Thanks [@minlovehua](https://github.com/minlovehua)! - bump angular into v19

## 18.0.1

### Patch Changes

- [#282](https://github.com/worktile/slate-angular/pull/282) [`7cb4403`](https://github.com/worktile/slate-angular/commit/7cb44033baf235f18e100d41d923de6315fd806c) Thanks [@Maple13](https://github.com/Maple13)! - removed extra injection chain caused by

## 18.0.0

### Major Changes

- [`bd823a1`](https://github.com/worktile/slate-angular/commit/bd823a16f2e76c31a9b068170758d8a077ab421c) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - upgrade angular into 18

## 17.4.5

### Patch Changes

- [#279](https://github.com/worktile/slate-angular/pull/279) [`4bb97c8`](https://github.com/worktile/slate-angular/commit/4bb97c8b5fae45ae2bb03725b1f58362db7e2b4a) Thanks [@Maple13](https://github.com/Maple13)! - fix setFragmentData error

## 18.0.0-next.0

### Major Changes

- [`9a4178b`](https://github.com/worktile/slate-angular/commit/9a4178be6b05590bb7229d3981a81981b6fdcae3) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - upgrade angular into 18

## 17.4.4

### Patch Changes

- [#277](https://github.com/worktile/slate-angular/pull/277) [`afd2ff3`](https://github.com/worktile/slate-angular/commit/afd2ff3941685114e34057e97f9790e4157da9d4) Thanks [@Maple13](https://github.com/Maple13)! - complete the table element structure obtained through the selection

## 17.4.3

### Patch Changes

- [`ec1cb4b`](https://github.com/worktile/slate-angular/commit/ec1cb4b5dd5e50fbde51bc707b0c4bd6c47767a1) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Should not replace focusNode by anchorNode that will cause selection waring when focusNode is in contenteditable
  Should return null instead of returning an error range when domRange is invalid

## 17.4.2

### Patch Changes

- [`4b60ed3`](https://github.com/worktile/slate-angular/commit/4b60ed343fe0803bfbe451b2f5055f8c163fa99b) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - exec scrollSelectionIntoView in setTimeout
  to determine the dom should have been updated when exec scrollSelectionIntoView

## 17.4.1

### Patch Changes

- [#276](https://github.com/worktile/slate-angular/pull/276) [`1c63833`](https://github.com/worktile/slate-angular/commit/1c6383306e8cc388b2bc92fc8952858f7f664d82) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - prevent set `contenteditable='false'` for inline void element

## 17.4.0

### Minor Changes

- [#275](https://github.com/worktile/slate-angular/pull/275) [`9da5fae`](https://github.com/worktile/slate-angular/commit/9da5faec83090b03615728decc560b865e195424) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - should return both text/html and files when clipboard has files

## 17.3.0

### Minor Changes

- [#273](https://github.com/worktile/slate-angular/pull/273) [`c65fea2`](https://github.com/worktile/slate-angular/commit/c65fea27c15e83a78c76fc3d4bf3d45fa03b2845) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - 1. In toDOMPoint, when the anchor or focus is on the block-card element and the selection is in the expanded state, the DOM selection is positioned on the cursor before and after, solving the problem that the beforeinput event cannot be triggered when the cursor is a block-card or void element (when the first element of the editor or table cell is a void element, Ctrl + A selects all) (contenteditable='false' is added to the void element) 2. Fix the problem of positioning the cursor before and after the block-card in toSlatePoint
  1. toDOMPoint 中当 anchor 或者 focus 在 block-card 元素上并且选区是 expanded 状态时，将 DOM 的 selection 定位到前后光标的上，解决光标所在的元素是 block-card 和 void 元素（编辑器或者表格单元格的第一个元素是 void 元素时，Ctrl + A 全选）时无法触发 beforeinput 事件（void 元素上增加了 contenteditable='false'）
  1. 修复 toSlatePoint 中对 block-card 前后光标定位的问题

- [#274](https://github.com/worktile/slate-angular/pull/274) [`2b7598e`](https://github.com/worktile/slate-angular/commit/2b7598e1bdde127e3b76ccb962abd988557efc66) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - bump slate into 0.103.0

## 17.2.2

### Patch Changes

- [#271](https://github.com/worktile/slate-angular/pull/271) [`39ac800`](https://github.com/worktile/slate-angular/commit/39ac800ae1c5dfb23f53d3ef0d430d8c594058df) Thanks [@huanhuanwa](https://github.com/huanhuanwa)! - only exec JSON.stringify for element

## 17.2.1

### Patch Changes

- [`e2cb948`](https://github.com/worktile/slate-angular/commit/e2cb94819f97e3f29111b8af79ef8c6353a54a34) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Revert "feat(core): remove slate-children/slate-leaves/SlateChildren/SlateLeaves"

## 17.2.0

### Minor Changes

- [`b45c27f`](https://github.com/worktile/slate-angular/commit/b45c27f1b99f38b5958425fcd057a25684c5a5ac) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - remove slate-children/slate-leaves/SlateChildren/SlateLeaves

  BREAKING CHANGE: the code segment using slate-children/slate-leaves/SlateChildren/SlateLeaves need been removed

- [#267](https://github.com/worktile/slate-angular/pull/267) [`146b69e`](https://github.com/worktile/slate-angular/commit/146b69e3e9d2c770a8236683a602d1ceb5bafb9f) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - apply navigator api and provider setClipboardData and getClipboardData methods

## 17.1.3

### Patch Changes

- [`13ef6ac`](https://github.com/worktile/slate-angular/commit/13ef6acd7555f8e6bfb02df00cad7aa289f2cba2) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - use map queue to store afterViewInit callback

  fix the issue that inline void element can not bind contentEditable attribute correctly

## 17.1.2

### Patch Changes

- [#265](https://github.com/worktile/slate-angular/pull/265) [`d9a14cc`](https://github.com/worktile/slate-angular/commit/d9a14cc885506357434492098e44105f5049efc6) Thanks [@huanhuanwa](https://github.com/huanhuanwa)! - fix isBlockCardLeftCursor and isBlockCardRightCursor error

## 17.1.1

### Patch Changes

- [`cf192c3`](https://github.com/worktile/slate-angular/commit/cf192c3aa91eeb2f4556d74081b07dfa8f125ec1) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - don't invoke normalize method default

## 17.1.0

### Minor Changes

- [`2b04410`](https://github.com/worktile/slate-angular/commit/2b04410d357b78b2942331c9472b40884ac84377) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - merge list-render pre release

## 16.1.0

### Minor Changes

- [#242](https://github.com/worktile/slate-angular/pull/242) [`bcfe6ab`](https://github.com/worktile/slate-angular/commit/bcfe6abfde24189db8040459f0bfbaa47dce911a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - initialize list render and leaves render to optimized rendering performance
  deprecated container

- [`4b7cbb6`](https://github.com/worktile/slate-angular/commit/4b7cbb6bcaed1ef1aaa9f51efc24fbb264bc9e4e) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support suppressThrow in toSlateRange/toSlatePoint/isLeafInEditor to check domSelection is valid

- [#246](https://github.com/worktile/slate-angular/pull/246) [`2fa7dd7`](https://github.com/worktile/slate-angular/commit/2fa7dd72d29c18fbbae0998ca94c3800c75839fd) Thanks [@Bricklou](https://github.com/Bricklou)! - Update dependencies (like slate) to latest versions

- [#242](https://github.com/worktile/slate-angular/pull/242) [`fface3b`](https://github.com/worktile/slate-angular/commit/fface3b4fc907b7f569a06d23a2ebf22bf2803ba) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - improve isLineBreakEmptyString、forEachMovedItem、setBaseAndExtent performance issues

### Patch Changes

- [#250](https://github.com/worktile/slate-angular/pull/250) [`40f4214`](https://github.com/worktile/slate-angular/commit/40f4214e86ad60b30ce7cf9a1c4cf6287e88823d) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support custom elements to set the position of children elements

- [`f3395b1`](https://github.com/worktile/slate-angular/commit/f3395b1937979236cade5d510c4ed62f1bfaa06a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - the beforeinput event will not fire while use press `deleteBackward` on void block element since remove contentEditable form void text element, so invoke deleteBackward manually as inline void element

- [`5d7d22d`](https://github.com/worktile/slate-angular/commit/5d7d22d5fe11cf2a666b4b5dc3d5613b83035f09) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add hasAfterContextChange that the timing is after detectChanges

- [`b494e6d`](https://github.com/worktile/slate-angular/commit/b494e6d8587562b0dae5d356c9acbabb8f714fa9) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Update README:
  1. depend on slate@0.101.5
  2. remove <slate-leaves></slate-leaves> from template of custom text component

- [`4ef6370`](https://github.com/worktile/slate-angular/commit/4ef6370b65494715e2190afab64d46ecf11bfd14) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Fix error when triple-clicking a word preceding a `contenteditable="false"` DOM node in Chrome
  refer to: https://github.com/ianstormtaylor/slate/pull/5343

- [`6eee752`](https://github.com/worktile/slate-angular/commit/6eee752297d0e447e9849e29a8c64b3691929bcc) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - remove path from SlateElementContext

- [`db55c5c`](https://github.com/worktile/slate-angular/commit/db55c5c958de8d473504cc5a391d9098f1d178d7) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support overridable methods expanded to control the expanded or collapsed state of children view, such as toggle-list plugin

- [`78bcc2b`](https://github.com/worktile/slate-angular/commit/78bcc2b539debcb69c55f917ddd7f4a526614452) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - isTargetInsideVoid add suppressThrow config

- [`f122a37`](https://github.com/worktile/slate-angular/commit/f122a3770ea0851688ba4b7292e7c05b496b36c8) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - update block card append timing

- [`f1e3831`](https://github.com/worktile/slate-angular/commit/f1e3831d107defbc0e1c4ca9a2e9fb035fa08ea3) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add contenteditable = 'false' when element is void（Revert recent logic changes）

- [`0657338`](https://github.com/worktile/slate-angular/commit/065733809960ec3c50c1c24f5bb92f1944760bfc) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - use parent element of outlet to insert fragment

- [`34a268a`](https://github.com/worktile/slate-angular/commit/34a268a4ce2291432c4951b86d2c0ff1d6748fe3) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - get template's root nodes by data-slate-node and data-slate-leaf attribute to avoid operating other HTMLElement

- [`fa62932`](https://github.com/worktile/slate-angular/commit/fa629326a82c4245f5d2c3d1ce99ed734c5f418b) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fix query void text error

- [`52fcaa1`](https://github.com/worktile/slate-angular/commit/52fcaa1f7cb6a680c02cdbc1a96059e30e8f1b53) Thanks [@huanhuanwa](https://github.com/huanhuanwa)! - prevent move selection when selection is in left or right cursor when click up

- [`b4f5020`](https://github.com/worktile/slate-angular/commit/b4f5020e1406cf147f5cc7c9b35ac11d5486dcde) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - export throttle utils

- [`e59cc1d`](https://github.com/worktile/slate-angular/commit/e59cc1db93672b9379b0937f72e21b86a2d28ead) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - should invoke initialize when previous children is empty

- [`0c59f49`](https://github.com/worktile/slate-angular/commit/0c59f492371b901c3bb7791b9a2bf2cc166e42af) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - cancel throttleRAF for setBaseAndExtent

- [`ae78be8`](https://github.com/worktile/slate-angular/commit/ae78be824c2a6fb03ea88c3c9920ff122da1451d) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - update detect changes timing when set context

- [`a43d313`](https://github.com/worktile/slate-angular/commit/a43d313d7bcfdfa277a2093d2687d32685561264) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - execute detectChanges after create black card component to avoid incorrect render timing of left and right caret

- [`edd539d`](https://github.com/worktile/slate-angular/commit/edd539d6abd59787c2c9c65ca5fe0effddfd31e1) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - update NODE_TO_INDEX and NODE_TO_PARENT when diffResult is undefined

- [#253](https://github.com/worktile/slate-angular/pull/253) [`fa01d81`](https://github.com/worktile/slate-angular/commit/fa01d81fbfd3c932cb4147d8175da46ff42cca29) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - handle triple-click
  remove the attribute of editable='false' in void element to void strange behavior when click before image element
  refer to:
  https://github.com/ianstormtaylor/slate/pull/4588
  https://github.com/ianstormtaylor/slate/pull/4965

- [`46d0659`](https://github.com/worktile/slate-angular/commit/46d0659f932923224af411798b57255f7003327e) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add afterViewInit method to handle performance issue
  set contenteditable will cause performance issue during dynamic created component execute detectChanges

## 16.1.0-next.20

### Patch Changes

- [`f3395b1`](https://github.com/worktile/slate-angular/commit/f3395b1937979236cade5d510c4ed62f1bfaa06a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - the beforeinput event will not fire while use press `deleteBackward` on void block element since remove contentEditable form void text element, so invoke deleteBackward manually as inline void element

## 16.1.0-next.19

### Patch Changes

- [`52fcaa1`](https://github.com/worktile/slate-angular/commit/52fcaa1f7cb6a680c02cdbc1a96059e30e8f1b53) Thanks [@huanhuanwa](https://github.com/huanhuanwa)! - prevent move selection when selection is in left or right cursor when click up

- [`edd539d`](https://github.com/worktile/slate-angular/commit/edd539d6abd59787c2c9c65ca5fe0effddfd31e1) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - update NODE_TO_INDEX and NODE_TO_PARENT when diffResult is undefined

## 16.1.0-next.18

### Patch Changes

- [`46d0659`](https://github.com/worktile/slate-angular/commit/46d0659f932923224af411798b57255f7003327e) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add afterViewInit method to handle performance issue
  set contenteditable will cause performance issue during dynamic created component execute detectChanges

## 16.1.0-next.17

### Patch Changes

- [`a43d313`](https://github.com/worktile/slate-angular/commit/a43d313d7bcfdfa277a2093d2687d32685561264) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - execute detectChanges after create black card component to avoid incorrect render timing of left and right caret

## 16.1.0-next.16

### Patch Changes

- [`78bcc2b`](https://github.com/worktile/slate-angular/commit/78bcc2b539debcb69c55f917ddd7f4a526614452) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - isTargetInsideVoid add suppressThrow config

## 16.1.0-next.15

### Minor Changes

- [`4b7cbb6`](https://github.com/worktile/slate-angular/commit/4b7cbb6bcaed1ef1aaa9f51efc24fbb264bc9e4e) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support suppressThrow in toSlateRange/toSlatePoint/isLeafInEditor to check domSelection is valid

## 16.1.0-next.14

### Patch Changes

- [`e59cc1d`](https://github.com/worktile/slate-angular/commit/e59cc1db93672b9379b0937f72e21b86a2d28ead) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - should invoke initialize when previous children is empty

## 16.1.0-next.13

### Patch Changes

- [`34a268a`](https://github.com/worktile/slate-angular/commit/34a268a4ce2291432c4951b86d2c0ff1d6748fe3) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - get template's root nodes by data-slate-node and data-slate-leaf attribute to avoid operating other HTMLElement

## 16.1.0-next.12

### Patch Changes

- [`f1e3831`](https://github.com/worktile/slate-angular/commit/f1e3831d107defbc0e1c4ca9a2e9fb035fa08ea3) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add contenteditable = 'false' when element is void（Revert recent logic changes）

## 16.1.0-next.11

### Patch Changes

- [`db55c5c`](https://github.com/worktile/slate-angular/commit/db55c5c958de8d473504cc5a391d9098f1d178d7) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support overridable methods expanded to control the expanded or collapsed state of children view, such as toggle-list plugin

## 16.1.0-next.10

### Patch Changes

- [`0657338`](https://github.com/worktile/slate-angular/commit/065733809960ec3c50c1c24f5bb92f1944760bfc) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - use parent element of outlet to insert fragment

## 16.1.0-next.9

### Patch Changes

- [`b494e6d`](https://github.com/worktile/slate-angular/commit/b494e6d8587562b0dae5d356c9acbabb8f714fa9) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Update README:
  1. depend on slate@0.101.5
  2. remove <slate-leaves></slate-leaves> from template of custom text component

- [`4ef6370`](https://github.com/worktile/slate-angular/commit/4ef6370b65494715e2190afab64d46ecf11bfd14) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Fix error when triple-clicking a word preceding a `contenteditable="false"` DOM node in Chrome
  refer to: https://github.com/ianstormtaylor/slate/pull/5343

- [#253](https://github.com/worktile/slate-angular/pull/253) [`fa01d81`](https://github.com/worktile/slate-angular/commit/fa01d81fbfd3c932cb4147d8175da46ff42cca29) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - handle triple-click
  remove the attribute of editable='false' in void element to void strange behavior when click before image element
  refer to:
  https://github.com/ianstormtaylor/slate/pull/4588
  https://github.com/ianstormtaylor/slate/pull/4965

## 16.1.0-next.8

### Minor Changes

- [#246](https://github.com/worktile/slate-angular/pull/246) [`2fa7dd7`](https://github.com/worktile/slate-angular/commit/2fa7dd72d29c18fbbae0998ca94c3800c75839fd) Thanks [@Bricklou](https://github.com/Bricklou)! - Update dependencies (like slate) to latest versions

### Patch Changes

- [#250](https://github.com/worktile/slate-angular/pull/250) [`40f4214`](https://github.com/worktile/slate-angular/commit/40f4214e86ad60b30ce7cf9a1c4cf6287e88823d) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support custom elements to set the position of children elements

## 16.1.0-next.7

### Patch Changes

- [`5d7d22d`](https://github.com/worktile/slate-angular/commit/5d7d22d5fe11cf2a666b4b5dc3d5613b83035f09) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add hasAfterContextChange that the timing is after detectChanges

## 16.1.0-next.6

### Patch Changes

- [`ae78be8`](https://github.com/worktile/slate-angular/commit/ae78be824c2a6fb03ea88c3c9920ff122da1451d) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - update detect changes timing when set context

## 16.1.0-next.5

### Patch Changes

- [`6eee752`](https://github.com/worktile/slate-angular/commit/6eee752297d0e447e9849e29a8c64b3691929bcc) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - remove path from SlateElementContext

## 16.1.0-next.4

### Patch Changes

- [`b4f5020`](https://github.com/worktile/slate-angular/commit/b4f5020e1406cf147f5cc7c9b35ac11d5486dcde) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - export throttle utils

## 16.1.0-next.3

### Patch Changes

- [`f122a37`](https://github.com/worktile/slate-angular/commit/f122a3770ea0851688ba4b7292e7c05b496b36c8) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - update block card append timing

## 16.1.0-next.2

### Patch Changes

- [`fa62932`](https://github.com/worktile/slate-angular/commit/fa629326a82c4245f5d2c3d1ce99ed734c5f418b) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - fix query void text error

## 16.1.0-next.1

### Patch Changes

- [`0c59f49`](https://github.com/worktile/slate-angular/commit/0c59f492371b901c3bb7791b9a2bf2cc166e42af) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - cancel throttleRAF for setBaseAndExtent

## 16.1.0-next.0

### Minor Changes

- [#242](https://github.com/worktile/slate-angular/pull/242) [`bcfe6ab`](https://github.com/worktile/slate-angular/commit/bcfe6abfde24189db8040459f0bfbaa47dce911a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - initialize list render and leaves render to optimized rendering performance
  deprecated container

- [#242](https://github.com/worktile/slate-angular/pull/242) [`fface3b`](https://github.com/worktile/slate-angular/commit/fface3b4fc907b7f569a06d23a2ebf22bf2803ba) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - improve isLineBreakEmptyString、forEachMovedItem、setBaseAndExtent performance issues

## 17.0.0

### Major Changes

- [#258](https://github.com/worktile/slate-angular/pull/258) [`ec6262d`](https://github.com/worktile/slate-angular/commit/ec6262dcfb302a5ab11882178feaeb2bbbc55e43) Thanks [@cmm-va](https://github.com/cmm-va)! - build: bump angular to 17

## 17.0.0-next.0

### Major Changes

- [#258](https://github.com/worktile/slate-angular/pull/258) [`ec6262d`](https://github.com/worktile/slate-angular/commit/ec6262dcfb302a5ab11882178feaeb2bbbc55e43) Thanks [@cmm-va](https://github.com/cmm-va)! - build: bump angular to 17

## 16.1.0-next

### Minor Changes

- [`406acf4`](https://github.com/worktile/slate-angular/commit/406acf4abf8a7dde716a11246ead9fd9db36f380) Thanks [@why520crazy](https://github.com/why520crazy)! - feat: bump is-hotkey and direction to 0.2.0 and 2.0.1, add dependence of package.json

- [`d2045d7`](https://github.com/worktile/slate-angular/commit/d2045d79cbd8db0af6238fe92de51cf3dc21cb14) Thanks [@why520crazy](https://github.com/why520crazy)! - feat: remove all Component suffix to simplify usage of standalone components

- [`51cda1a`](https://github.com/worktile/slate-angular/commit/51cda1a3766cb0102e57a119b8c3100f8233a72a) Thanks [@why520crazy](https://github.com/why520crazy)! - feat(core): support standalone components

## 15.1.3

### Patch Changes

- [`dd5c1b2`](https://github.com/worktile/slate-angular/commit/dd5c1b2a60bad3ed17eaad48611515f56001fc94) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - should set viewContext before set context

## 15.1.2

### Patch Changes

- [`e163f01`](https://github.com/worktile/slate-angular/commit/e163f01ed5d9cc7265df17668622543e79bff33d) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add isLeafInEditor and isNodeInEditor to test target leaf whether belong to current editor
  correct selection when focus in void element include slate-angular component

## 15.1.1

### Patch Changes

- [`a9610f0`](https://github.com/worktile/slate-angular/commit/a9610f07c407de468433716ee121f8090127210e) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - do not invoke scrollSelectionIntoView when newDomRange is null

## 15.1.0

### Minor Changes

- [#230](https://github.com/worktile/slate-angular/pull/230) [`08f1b72`](https://github.com/worktile/slate-angular/commit/08f1b722392a0c7d2873db11dd7cd329c24aba0b) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support scrollSelectionIntoView and defaultScrollSelectionIntoView method

- [#227](https://github.com/worktile/slate-angular/pull/227) [`05d46dd`](https://github.com/worktile/slate-angular/commit/05d46dd144d585e0f5795fd294bcc30ed9fcba7d) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - android input handing

- [#228](https://github.com/worktile/slate-angular/pull/228) [`afc99b0`](https://github.com/worktile/slate-angular/commit/afc99b066e0e6e0a01b419d882d9becea8c76884) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add default string component

### Patch Changes

- [`8f443fd`](https://github.com/worktile/slate-angular/commit/8f443fd5c32af182453276c9bbd300750d444026) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - remove textNode and br on previous type is lineBreakEmptyString
  export defaultScrollSelectionIntoView function

- [`cf4e323`](https://github.com/worktile/slate-angular/commit/cf4e323c09ad60aacc54083d5648e4c33dcf5d2c) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - export hasEditableTarget and composition update event

- [`64e3f81`](https://github.com/worktile/slate-angular/commit/64e3f81fcb8dac22b6712b257e50e25dd76358e3) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - android issue: get targetRange from dom selection when event can not get nativeTargetRange

- [`1a32c9e`](https://github.com/worktile/slate-angular/commit/1a32c9ef6851f35025b22e5cd5d879d1fd473ada) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - handle scroll issue when cursor in the black card

- [`20b5cb5`](https://github.com/worktile/slate-angular/commit/20b5cb524fcb48b97f20468601112c70d4dbeac5) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - handle insertText in Android device

- [`a691d0b`](https://github.com/worktile/slate-angular/commit/a691d0b1a5077ffee2c3eb868a30f11eb7cbd1bd) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Text nodes support generic T

- [`a7348cd`](https://github.com/worktile/slate-angular/commit/a7348cdbbd49dc263cd7d8176939d575236b3511) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - solved innerText render error for '\n'

- [#231](https://github.com/worktile/slate-angular/pull/231) [`fb749c5`](https://github.com/worktile/slate-angular/commit/fb749c5789f7e10312d7821fc92c92eb5acc6b19) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - default string support lineBreakEmptyString

## 15.1.0-next.4

### Patch Changes

- [`8f443fd`](https://github.com/worktile/slate-angular/commit/8f443fd5c32af182453276c9bbd300750d444026) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - remove textNode and br on previous type is lineBreakEmptyString
  export defaultScrollSelectionIntoView function

## 15.1.0-next.3

### Patch Changes

- [#231](https://github.com/worktile/slate-angular/pull/231) [`fb749c5`](https://github.com/worktile/slate-angular/commit/fb749c5789f7e10312d7821fc92c92eb5acc6b19) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - default string support lineBreakEmptyString

## 15.1.0-next.2

### Minor Changes

- [#230](https://github.com/worktile/slate-angular/pull/230) [`08f1b72`](https://github.com/worktile/slate-angular/commit/08f1b722392a0c7d2873db11dd7cd329c24aba0b) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support scrollSelectionIntoView and defaultScrollSelectionIntoView method

## 15.1.0-next.1

### Patch Changes

- [`64e3f81`](https://github.com/worktile/slate-angular/commit/64e3f81fcb8dac22b6712b257e50e25dd76358e3) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - android issue: get targetRange from dom selection when event can not get nativeTargetRange

## 15.1.0-next.0

### Minor Changes

- [#227](https://github.com/worktile/slate-angular/pull/227) [`05d46dd`](https://github.com/worktile/slate-angular/commit/05d46dd144d585e0f5795fd294bcc30ed9fcba7d) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - android input handing

- [#228](https://github.com/worktile/slate-angular/pull/228) [`afc99b0`](https://github.com/worktile/slate-angular/commit/afc99b066e0e6e0a01b419d882d9becea8c76884) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add default string component

### Patch Changes

- [`20b5cb5`](https://github.com/worktile/slate-angular/commit/20b5cb524fcb48b97f20468601112c70d4dbeac5) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - handle insertText in Android device

- [`a7348cd`](https://github.com/worktile/slate-angular/commit/a7348cdbbd49dc263cd7d8176939d575236b3511) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - solved innerText render error for '\n'

## 15.0.0

### Major Changes

- [#223](https://github.com/worktile/slate-angular/pull/223) [`ad8ce3f`](https://github.com/worktile/slate-angular/commit/ad8ce3fc87bc221d811a17947e30f9dc21144f21) Thanks [@Maple13](https://github.com/Maple13)! - optimizing angular 15 upgrade

* [#222](https://github.com/worktile/slate-angular/pull/222) [`33095ae`](https://github.com/worktile/slate-angular/commit/33095ae08bd56b69723ad8777e04e45c23cc5f28) Thanks [@Ashy6](https://github.com/Ashy6)! - 升级 Angular 15

## 14.1.3

### Patch Changes

- [#220](https://github.com/worktile/slate-angular/pull/220) [`b3525ab`](https://github.com/worktile/slate-angular/commit/b3525ab1d5579fc47800b37aeee14b2ed480a8b9) Thanks [@donaldxdonald](https://github.com/donaldxdonald)! - fix legacy check for Edge and Firefox v100+

* [`27591d4`](https://github.com/worktile/slate-angular/commit/27591d4dd8e02dc8944b71e650d804f357879afa) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - use break-spaces value for white-space, avoid end-of-line hang

## 14.1.2

### Patch Changes

- [`3a538b0`](https://github.com/worktile/slate-angular/commit/3a538b09422031b2bac9e1561401ef64421b1742) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - support dynamic placeholder

## 14.1.1

### Patch Changes

- [`98548be`](https://github.com/worktile/slate-angular/commit/98548bede7a0ea8e94cc34e4bfd4caf4310c89ad) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - prevent updating native selection when active element is void element

## 14.0.0

### Major Changes

- [`c065c98`](https://github.com/worktile/slate-angular/commit/c065c986ef41aff45ee20626ba0b16575574fbef) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - 升级 Angular 14

## 13.1.0

### Minor Changes

- [`cbc2b33`](https://github.com/worktile/slate-angular/commit/cbc2b33364c2454529f67ff01f81cf25abc52292) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - use context selection calc isCollapsed and resolve editor is undefined error

## 13.0.6

### Patch Changes

- [`deeed17`](https://github.com/worktile/slate-angular/commit/deeed17c488a830913763bdb62f3e501ab260be1) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - add isCollapsedAndNonReadonly property

## 13.0.5

### Patch Changes

- [`e79030a`](https://github.com/worktile/slate-angular/commit/e79030ab6e1d22a8d99601e268f1e55f0dbe0955) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - stop beforeinput event handle when focus void node

## 13.0.4

### Patch Changes

- [`2c3d403`](https://github.com/worktile/slate-angular/commit/2c3d403977f8b1933049f194d0e3bd6f3596e43e) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - stop keydown action when focus node

## 13.0.3

### Patch Changes

- [`ed86a61`](https://github.com/worktile/slate-angular/commit/ed86a618348eb7c0d9b539a3cc3300a6170e7f9a) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Solve the problem that the editable area in the Void node is abnormally out of focus

## 13.0.2

### Patch Changes

- [#207](https://github.com/worktile/slate-angular/pull/207) [`625886b`](https://github.com/worktile/slate-angular/commit/625886b20efbfa3f2e21e67a9834f08b05687fea) Thanks [@donaldxdonald](https://github.com/donaldxdonald)! - Allow copying of slate nodes in readonly mode

## 13.0.1

### Patch Changes

- [`75de637`](https://github.com/worktile/slate-angular/commit/75de637821f650d64c7410ed5ef5d07de24e8d7f) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - [build] add license for npm package

## 13.0.0

### Major Changes

- [#203](https://github.com/worktile/slate-angular/pull/203) [`4809484`](https://github.com/worktile/slate-angular/commit/4809484df20a81ff61307606dbb23be6afd12f18) Thanks [@why520crazy](https://github.com/why520crazy)! - [deps] upgrade angular 13

## 1.9.3

### Patch Changes

- [#195](https://github.com/worktile/slate-angular/pull/195) [`9d00976`](https://github.com/worktile/slate-angular/commit/9d00976573608d15a5accb1131785d025f207274) Thanks [@huanhuanwa](https://github.com/huanhuanwa)! - [utils]: Fix the RegExp of judging the old version of chrome

## 1.9.2

### Patch Changes

- [#191](https://github.com/worktile/slate-angular/pull/191) [`1f32060`](https://github.com/worktile/slate-angular/commit/1f320608e9e968f2fb8d1b963cfdd09ed4efab5a) Thanks [@huanhuanwa](https://github.com/huanhuanwa)! - in move_node, replace path with pathRef

## 1.9.1

### Patch Changes

- [#185](https://github.com/worktile/slate-angular/pull/185) [`bb237a8`](https://github.com/worktile/slate-angular/commit/bb237a8243aec0a4f1386b131cc5726b008aa7a4) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - remove native DOM selection when slate selection is null

* [#188](https://github.com/worktile/slate-angular/pull/188) [`4e50b91`](https://github.com/worktile/slate-angular/commit/4e50b912b2f970e754cdb571f9fc9e570d89ba17) Thanks [@huanhuanwa](https://github.com/huanhuanwa)! - modify the method of getting matches in move_node

## 1.9.0

### Minor Changes

- [#182](https://github.com/worktile/slate-angular/pull/182) [`2d3eb49`](https://github.com/worktile/slate-angular/commit/2d3eb49235aa8868d230268df8f851d8c949b605) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Solve the dom loss when moving nodes

## 1.8.0

### Minor Changes

- [#178](https://github.com/worktile/slate-angular/pull/178) [`eec7fa3`](https://github.com/worktile/slate-angular/commit/eec7fa33fe21f87bfea10343d3ccf4b51ceb8164) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Add insertFragmentData and insertTextData to the AngularEditor API - sync slate-react

* [#178](https://github.com/worktile/slate-angular/pull/178) [`bb9464d`](https://github.com/worktile/slate-angular/commit/bb9464d6af875c220daa2a40bd53e31f61d9ab36) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Add origin event type to setFragmentData to be able to distinguish copy, cut and drag

### Patch Changes

- [#178](https://github.com/worktile/slate-angular/pull/178) [`8db5a01`](https://github.com/worktile/slate-angular/commit/8db5a01fbda8b52dc1b7cfb3b33831d6d8a87f48) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Fix crash on drag and drop image on readOnly editable

* [#178](https://github.com/worktile/slate-angular/pull/178) [`af07fa4`](https://github.com/worktile/slate-angular/commit/af07fa44d76f2721ead57e75f2d84bb49037a53b) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Allow setFragmentData to work without copy/paste or DnD data structure

## 1.7.5

### Patch Changes

- [#173](https://github.com/worktile/slate-angular/pull/173) [`1f164e9`](https://github.com/worktile/slate-angular/commit/1f164e9d556bd893aa79460bde1cc6c91a868923) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Fix focus movement and paragraph height issues under firefox

## 1.7.4

### Patch Changes

- [`004015c`](https://github.com/worktile/slate-angular/commit/004015cbb97f45df9d51944147fffe290b31d49e) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - correct placeholder position, placeholder span must be inside text node

## 1.7.3

### Patch Changes

- [#168](https://github.com/worktile/slate-angular/pull/168) [`4c6d50e`](https://github.com/worktile/slate-angular/commit/4c6d50ec090366f114191b8e696bb4ae9edbeb7c) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - refactor placeholder, fix IME input issues

## 1.7.2

### Patch Changes

- [`3d7f548`](https://github.com/worktile/slate-angular/commit/3d7f5487b37116fa0113c8fbabff777c32b15eb9) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - 引入 changesets 工具

### [1.7.1](https://github.com/worktile/slate-angular/compare/v1.7.0...v1.7.1) (2022-01-12)

### Bug Fixes

- **placeholder:** fix(placeholder): use default value when placeholderDecorate is empty
- **core:** fix(core): check for existing context in BaseTextComponent.text

### [1.7.0](https://github.com/worktile/slate-angular/compare/v1.6.5...v1.7.0) (2021-12-23)

### Features

- **placeholder:** feat(decorate): add placeholder (#159) 感谢 @FrankWang117

### Bug Fixes

- **core:** handle move nodes Transforms.moveNodes does not work #150
- **core:** fix(core): handling of delete in Chrome when inline void node is selected

### [1.6.5](https://github.com/worktile/slate-angular/compare/v1.6.4...v1.6.5) (2021-11-03)

### Features

- **core:** feat(core): bump slate to 0.67.1 and remove override normalizeNode

### [1.6.4](https://github.com/worktile/slate-angular/compare/v1.6.3...v1.6.4) (2021-11-02)

### Features

- **core:** feat(core): remove scroll-into-view-if-needed

### [1.6.3](https://github.com/worktile/slate-angular/compare/v1.6.2...v1.6.3) (2021-10-15)

### Bug Fixes

- **core:** fix the IME input fails when text is selected

### [1.6.2](https://github.com/worktile/slate-angular/compare/v1.5.4...v1.6.2) (2021-10-13)

### Features

- **plugin:** add deleteCutData function for cut

### [1.5.4](https://github.com/worktile/slate-angular/compare/v1.5.3...v1.5.4) (2021-10-11)

### Bug Fixes

- **core:** fix(core): add editable-text on the span for leaf

### [1.5.3](https://github.com/worktile/slate-angular/compare/v1.5.2...v1.5.3) (2021-10-09)

### Bug Fixes

- **core:** fix(core): correct render return value type

### [1.5.2](https://github.com/worktile/slate-angular/compare/v1.5.1...v1.5.2) (2021-09-30)

### Bug Fixes

- **core:** fix(core): correct isComposing for collaboration #WIK-4870

### [1.5.1](https://github.com/worktile/slate-angular/compare/v1.5.0...v1.5.1) (2021-09-28)

### Bug Fixes

- **view:** fix(view): modify the definition as directive

### [1.5.0](https://github.com/worktile/slate-angular/compare/v1.4.2...v1.5.0) (2021-09-27)

### Features

- **core:** feat(core): bump angular to 12

### [1.4.2](https://github.com/worktile/slate-angular/compare/v1.4.1...v1.4.2) (2021-09-23)

### Bug Fixes

- **core:** fix(core): remove selectionchange throttle to avoid selection out of sync

### [1.4.1](https://github.com/worktile/slate-angular/compare/v1.4.0...v1.4.1) (2021-09-18)

### Features

- **decorate:** feat(decorate): support isStrictDecorate

### [1.4.0](https://github.com/worktile/slate-angular/compare/v1.4.0...v1.3.1) (2021-08-31)

### Bug Fixes

- **core:** feat(core): contextChange not execute when readonly changes

### [1.3.1](https://github.com/worktile/slate-angular/compare/v1.3.1...v1.3.0) (2021-08-19)

### Features

- **block-card:** feat(block-card): remove block card contenteditable false

### [1.3.0](https://github.com/worktile/slate-angular/compare/v1.3.0...v1.2.2) (2021-08-19)

### Bug Fixes

- **global-normalize:** fix(global-normalize): fix selection is empty

### Features

- **core:** feat(core): feat(core): add editable debug time

### [1.2.2](https://github.com/worktile/slate-angular/compare/v1.2.2...v1.2.1) (2021-08-06)

### Bug Fixes

- **core:** fix(core): fix the dom selection is not converted correctly

### [1.2.1](https://github.com/worktile/slate-angular/compare/v1.2.1...v1.2.0) (2021-08-03)

### Bug Fixes

- **core:** fix(core): fix cursor problem in shared editor

### [1.2.0](https://github.com/worktile/slate-angular/compare/v1.2.0...v1.1.9) (2021-07-20)

### Features

- **core:** feat(core): dynamic handle readonly [#99](https://github.com/worktile/slate-angular/issues/99)

### [1.1.9](https://github.com/worktile/slate-angular/compare/v1.1.8...v1.1.9) (2021-07-16)

### Bug Fixes

- **core:** fix(core): adjust leaf insert position
- **core:** feat(global-normalize): add and apply global-normalize
- **core:** fix(view): compat empty children render

### [1.1.8](https://github.com/worktile/slate-angular/compare/v1.1.7...v1.1.8) (2021-07-06)

### Bug Fixes

- **core:** fix(core): remove call delete fragment when paste

### [1.1.7](https://github.com/worktile/slate-angular/compare/v1.1.4...v1.1.7) (2021-06-28)

### Bug Fixes

- **block-card:** fix(block-card): fix block card update problem when enable ivy

### [1.1.4](https://github.com/worktile/slate-angular/compare/v1.1.3...v1.1.4) (2021-06-21)

### Bug Fixes

- **config:** fix(config): fix peerDependencies
- **core:** refactor(core): update keydown parameters
- **core:** fix(core): fix fragment insert

### [1.1.3](https://github.com/worktile/slate-angular/compare/v1.1.1...v1.1.3) (2021-06-09)

### Features

- **view:** refactor(view): refactor block-card logic and api

### Bug Fixes

- **core:** fix(core): correct IS_FOCUSED status on block card
- **core:** fix(core): add data-slate-leaf to BaseLeafComponent #WIK-4119

### [1.1.1](https://github.com/worktile/slate-angular/compare/v1.1.0...v1.1.1) (2021-06-02)

## [1.1.0](https://github.com/worktile/slate-angular/compare/v1.0.3...v1.1.0) (2021-06-02)

### Features

- **plugin:** delete current line when deleting backward with line unit ([bc5e331](https://github.com/worktile/slate-angular/commit/bc5e33151817935e904bc81e7b67808863182a6e))
- **view:** implementation for working with non-global window instances ([7b76474](https://github.com/worktile/slate-angular/commit/7b76474f9c1f7c89ec53edda9161fefe43f349c4))

### Bug Fixes

- **browser:** disable spellCheck, autoCorrect, autoCapitalize when browser doesnt HAS_BEFORE_INPUT_SUPPORT ([5ab5677](https://github.com/worktile/slate-angular/commit/5ab56777d228092c763ee6a19d60ad97f9492b8e))
- **browser:** editor auto-scrolling behavior when a block is bigger than the viewport ([ce0fb06](https://github.com/worktile/slate-angular/commit/ce0fb065ec89e5618cf0479da2c7468913249bdb))
- **browser:** fix cursor movement in RTL elements ([098ea24](https://github.com/worktile/slate-angular/commit/098ea24ef485490777509f1297ebc2897765e51d))
- **browser:** fix domSelection undefined ([ed0877d](https://github.com/worktile/slate-angular/commit/ed0877d66d3158a2897e19142716bbefc24b0254))
- **browser:** fixes Slate to work with the Shadow DOM ([e8cf304](https://github.com/worktile/slate-angular/commit/e8cf3042ff1af93165280c5aee28c390e7faf23f))
- **browser:** revert condition ([bc7c1da](https://github.com/worktile/slate-angular/commit/bc7c1daa52ddcd80f65e0ddb99699af03343e951))
- **core:** angularEditor maintains independence ([a700300](https://github.com/worktile/slate-angular/commit/a7003009bc0817a42a5d20f31b5cc5127821eb08))
- **core:** collapse expanded selection before handling `moveWordBackward` (`alt + left`) and `moveWordForward` (`alt + right`) hotkeys ([c281a74](https://github.com/worktile/slate-angular/commit/c281a746f62e060660e326199a575b8087f84bcc))
- **core:** collapse selection according to reverse ([6dbfa60](https://github.com/worktile/slate-angular/commit/6dbfa6015186c3869e08ba24dce94b9c63f2b076))
- **core:** cut will remove void element when only select void element ([1ec3923](https://github.com/worktile/slate-angular/commit/1ec3923d070c3ba1a57b8b1d285a8b23803394ca))
- **core:** fix drag and drop logic ([#4238](https://github.com/worktile/slate-angular/issues/4238)) ([a9960ec](https://github.com/worktile/slate-angular/commit/a9960ecafcc6c9ac22cb63ec9880861599dc1844))
- **core:** fix format ([3360bad](https://github.com/worktile/slate-angular/commit/3360badb37fb1f18fc8d4136827fcdc2e233f5b7))
- **core:** fix normalizeDOMPoint to do better job ([#4048](https://github.com/worktile/slate-angular/issues/4048)) ([cfa0088](https://github.com/worktile/slate-angular/commit/cfa0088aec7610c4d78de0939afa78273d2a9fa2))
- **core:** fixed an issue with controlled value messing up editor.selection ([e3b7a08](https://github.com/worktile/slate-angular/commit/e3b7a08fefdafa0b1492c9017aa7e865d9988842))
- **core:** fixed converting querySelectorAll results to array ([ea58e3f](https://github.com/worktile/slate-angular/commit/ea58e3f1aaf61e3b6fb93c700258ab23c745db42))
- **demo:** fix Type Error ([7d43290](https://github.com/worktile/slate-angular/commit/7d4329081f6196cf506aa8ee48ba94873d302f0d))
- **types:** define ret type ([58b93ec](https://github.com/worktile/slate-angular/commit/58b93ecc68efbf7788f263f77b8fd5a2797e3e9f))

### [1.0.3](https://github.com/worktile/slate-angular/compare/v1.0.2...v1.0.3) (2021-05-27)

### Bug Fixes

- **browser:** fix cursor move warn for qq browser ([ace5697](https://github.com/worktile/slate-angular/commit/ace56976672a5c0501209c5686f654c0541bce8c))

### [1.0.2](https://github.com/worktile/slate-angular/compare/v1.0.1...v1.0.2) (2021-05-27)

### Features

- **demo:** add image demo #WIK-563 ([2beefb1](https://github.com/worktile/slate-angular/commit/2beefb1b647a17c221b25b91fbfaf43bad01321e)), closes [#WIK-563](https://github.com/worktile/slate-angular/issues/WIK-563)
- **demo:** add search highlighting ([faa76e6](https://github.com/worktile/slate-angular/commit/faa76e61d3ded9e931cc99e294d6d11e7f1f8736))
- **demo:** add table demo #WIK-697 ([925674b](https://github.com/worktile/slate-angular/commit/925674becef0581d418e954bd049b62777d99819)), closes [#WIK-697](https://github.com/worktile/slate-angular/issues/WIK-697)
- **demo:** adjust demo style ([622b5a6](https://github.com/worktile/slate-angular/commit/622b5a6a8074948c9faaa88ac81207b53b867fa8))
- **demo:** remove click ([6fdd599](https://github.com/worktile/slate-angular/commit/6fdd599cb6aab1d12b2a7c58babe9cc1935596fd))

### Bug Fixes

- **demo:** fix change method ([135df58](https://github.com/worktile/slate-angular/commit/135df5847cf7d671ab7a2446fd83033e6569974a))
- **view:** catch the invalid data range ([e6201d7](https://github.com/worktile/slate-angular/commit/e6201d7b3a7e1795606a1f39aa70e678673c618e))

### [1.0.1](https://github.com/worktile/slate-angular/compare/v1.0.0...v1.0.1) (2021-05-27)

### Features

- **core:** add trackby and update README ([3fc5240](https://github.com/worktile/slate-angular/commit/3fc5240329dd8b5df368260e9c26ab83481ee192))

## [1.0.0](https://github.com/worktile/slate-angular/compare/v0.53.3...v1.0.0) (2021-05-27)

### Features

- **view:** refactor angular view render ([40a636a](https://github.com/worktile/slate-angular/commit/40a636a7f9a86aa6a93fb583a787c6c67fd41fb7))

### Bug Fixes

- **core:** avoid merge the empty text #WIK-3805 ([3206b1a](https://github.com/worktile/slate-angular/commit/3206b1a6b35d03a15c2e1e113c4d5681b0a5e335)), closes [#WIK-3805](https://github.com/worktile/slate-angular/issues/WIK-3805)

### [0.53.4](https://github.com/worktile/slate-angular/compare/v0.53.3...v0.53.4) (2021-05-27)

### Bug Fixes

- **core:** avoid merge the empty text #WIK-3805 ([3206b1a](https://github.com/worktile/slate-angular/commit/3206b1a6b35d03a15c2e1e113c4d5681b0a5e335)), closes [#WIK-3805](https://github.com/worktile/slate-angular/issues/WIK-3805)

### [0.53.3](https://github.com/worktile/slate-angular/compare/v0.53.2...v0.53.3) (2021-04-22)

### Bug Fixes

- **core:** fix throw error when selectionchange #WIK-3788 ([881b65a](https://github.com/worktile/slate-angular/commit/881b65ab5cb671dd8a1b28d321040b20f97cabda)), closes [#WIK-3788](https://github.com/worktile/slate-angular/issues/WIK-3788)
- **core:** modify card-right offset to -2 ([143adad](https://github.com/worktile/slate-angular/commit/143adad48d2717fa30eb033f528d6d92cd953b97))

### [0.53.2](https://github.com/worktile/slate-angular/compare/v0.53.1...v0.53.2) (2021-04-22)

### Features

- **core:** add logic to correct DOMSelection #WIK-3786 ([75cdb90](https://github.com/worktile/slate-angular/commit/75cdb90df74e8f2386546597edf22911eac643e1)), closes [#WIK-3786](https://github.com/worktile/slate-angular/issues/WIK-3786)

### Bug Fixes

- **core:** call deleteFragment before paste to avoid invalid data #WIK-3784 ([24d4c25](https://github.com/worktile/slate-angular/commit/24d4c258d9af6333ea60b088a89e668d7978514e)), closes [#WIK-3784](https://github.com/worktile/slate-angular/issues/WIK-3784)
- **plugin:** add isFocusedPath to ensure selection is on the text WIK-3762 ([#28](https://github.com/worktile/slate-angular/issues/28)) ([006d3f8](https://github.com/worktile/slate-angular/commit/006d3f89b99d17b2eef650bd63dfb856bf6e5bb2))

### [0.53.1](https://github.com/worktile/slate-angular/compare/v0.53.0...v0.53.1) (2021-04-21)

### Features

- **core:** support custom clipboard format key #WIK-3782 ([3e8a832](https://github.com/worktile/slate-angular/commit/3e8a832a7c9247acd76cf4ebf35fa7573411b096)), closes [#WIK-3782](https://github.com/worktile/slate-angular/issues/WIK-3782)

### Bug Fixes

- **block-card:** fix forward set path error #WIK-3779 ([2619ff5](https://github.com/worktile/slate-angular/commit/2619ff54a3626164333fd3d504b3392f072afb63)), closes [#WIK-3779](https://github.com/worktile/slate-angular/issues/WIK-3779)
- **block-card:** fix get cursor error ([e6a2d61](https://github.com/worktile/slate-angular/commit/e6a2d61a98befd04df197f09b0e52b3b0a47707c))

## [0.53.0](https://github.com/worktile/slate-angular/compare/v0.52.0...v0.53.0) (2021-04-19)

### Bug Fixes

- **core:** support the expand range for card-left/card-center/card-right ([953be38](https://github.com/worktile/slate-angular/commit/953be385e55e34cfad7ee4c15cc7b7a54a93025d))

## [0.52.0](https://github.com/worktile/slate-angular/compare/v0.51.0...v0.52.0) (2021-04-19)

### Features

- **core:** suport slate selection for block card ([9c1591b](https://github.com/worktile/slate-angular/commit/9c1591b669bbc15a922534e3cc1babae9fec268d))

### Bug Fixes

- **browser:** compat firefox fire twice composition end #WIK-3760 ([f377954](https://github.com/worktile/slate-angular/commit/f3779545d34239b9fadb7b076514a23169ba92c2)), closes [#WIK-3760](https://github.com/worktile/slate-angular/issues/WIK-3760)

### [0.51.1](https://github.com/worktile/slate-angular/compare/v0.51.0...v0.51.1) (2021-04-15)

### Bug Fixes

- **browser:** compat firefox fire twice composition end #WIK-3760 ([f377954](https://github.com/worktile/slate-angular/commit/f3779545d34239b9fadb7b076514a23169ba92c2)), closes [#WIK-3760](https://github.com/worktile/slate-angular/issues/WIK-3760)

## [0.51.0](https://github.com/worktile/slate-angular/compare/v0.50.3...v0.51.0) (2021-04-13)

### Bug Fixes

- **core:** refactor ng model and fix test error ([3ab7cc1](https://github.com/worktile/slate-angular/commit/3ab7cc108d08098fd4c68ec81a2b86131738dc5d))

### [0.50.3](https://github.com/worktile/slate-angular/compare/v0.50.2...v0.50.3) (2021-04-12)

### Bug Fixes

- **core:** fix componentRef rootNodes ([9ee7466](https://github.com/worktile/slate-angular/commit/9ee746627293490f85a15bf2acbba67c5672cfd2))

### [0.50.2](https://github.com/worktile/slate-angular/compare/v0.50.1...v0.50.2) (2021-04-12)

### Bug Fixes

- **core:** call onChangeCallback after reRender ([e156610](https://github.com/worktile/slate-angular/commit/e1566102eeebb3c4ce696f45351b287bf166570b))

### 0.50.1 (2021-04-12)

### Features

- **config:** update config ([8712d51](https://github.com/worktile/slate-angular/commit/8712d5130c750b96a9766ffc642e717d2da9784f))
- **core:** init slate-angular ([a141fd4](https://github.com/worktile/slate-angular/commit/a141fd49db51c45c27a1fe9c13eb2efeab65b5eb))
- **core:** support rootNodes ([6021de3](https://github.com/worktile/slate-angular/commit/6021de369550b3c15822062ff55a68254622e4b2))

### Bug Fixes

- **core:** fix format code bug #WIK-3715 ([74bd53b](https://github.com/worktile/slate-angular/commit/74bd53b5c7399adba315cd75e897abf1b43d84a4)), closes [#WIK-3715](https://github.com/worktile/slate-angular/issues/WIK-3715)
- **core:** set empty paragraph when empty value #INFR-1790 ([6450e76](https://github.com/worktile/slate-angular/commit/6450e7609d3d2f4c333056850c18af87228b7cf8)), closes [#INFR-1790](https://github.com/worktile/slate-angular/issues/INFR-1790)
- **template:** prevent selectionchange when IME between 'aa\n' and '\n' #WIK-3703 ([2e538c5](https://github.com/worktile/slate-angular/commit/2e538c5535d87a8022579a1ea6344181fe069ca3)), closes [#WIK-3703](https://github.com/worktile/slate-angular/issues/WIK-3703)
