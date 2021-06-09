# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.1.3](https://github.com/worktile/slate-angular/compare/v1.1.1...v1.1.3) (2021-06-09)


### Features

* **view:** refactor(view): refactor block-card logic and api

### Bug Fixes

* **core:** fix(core): correct IS_FOCUSED status on block card
* **core:** fix(core): add data-slate-leaf to BaseLeafComponent #WIK-4119

### [1.1.1](https://github.com/worktile/slate-angular/compare/v1.1.0...v1.1.1) (2021-06-02)

## [1.1.0](https://github.com/worktile/slate-angular/compare/v1.0.3...v1.1.0) (2021-06-02)


### Features

* **plugin:** delete current line when deleting backward with line unit ([bc5e331](https://github.com/worktile/slate-angular/commit/bc5e33151817935e904bc81e7b67808863182a6e))
* **view:** implementation for working with non-global window instances ([7b76474](https://github.com/worktile/slate-angular/commit/7b76474f9c1f7c89ec53edda9161fefe43f349c4))


### Bug Fixes

* **browser:** disable spellCheck, autoCorrect, autoCapitalize when browser doesnt HAS_BEFORE_INPUT_SUPPORT ([5ab5677](https://github.com/worktile/slate-angular/commit/5ab56777d228092c763ee6a19d60ad97f9492b8e))
* **browser:** editor auto-scrolling behavior when a block is bigger than the viewport ([ce0fb06](https://github.com/worktile/slate-angular/commit/ce0fb065ec89e5618cf0479da2c7468913249bdb))
* **browser:** fix cursor movement in RTL elements ([098ea24](https://github.com/worktile/slate-angular/commit/098ea24ef485490777509f1297ebc2897765e51d))
* **browser:** fix domSelection undefined ([ed0877d](https://github.com/worktile/slate-angular/commit/ed0877d66d3158a2897e19142716bbefc24b0254))
* **browser:** fixes Slate to work with the Shadow DOM ([e8cf304](https://github.com/worktile/slate-angular/commit/e8cf3042ff1af93165280c5aee28c390e7faf23f))
* **browser:** revert condition ([bc7c1da](https://github.com/worktile/slate-angular/commit/bc7c1daa52ddcd80f65e0ddb99699af03343e951))
* **core:** angularEditor maintains independence ([a700300](https://github.com/worktile/slate-angular/commit/a7003009bc0817a42a5d20f31b5cc5127821eb08))
* **core:** collapse expanded selection before handling `moveWordBackward` (`alt + left`) and `moveWordForward` (`alt + right`) hotkeys ([c281a74](https://github.com/worktile/slate-angular/commit/c281a746f62e060660e326199a575b8087f84bcc))
* **core:** collapse selection according to reverse ([6dbfa60](https://github.com/worktile/slate-angular/commit/6dbfa6015186c3869e08ba24dce94b9c63f2b076))
* **core:** cut will remove void element when only select void element ([1ec3923](https://github.com/worktile/slate-angular/commit/1ec3923d070c3ba1a57b8b1d285a8b23803394ca))
* **core:** fix drag and drop logic ([#4238](https://github.com/worktile/slate-angular/issues/4238)) ([a9960ec](https://github.com/worktile/slate-angular/commit/a9960ecafcc6c9ac22cb63ec9880861599dc1844))
* **core:** fix format ([3360bad](https://github.com/worktile/slate-angular/commit/3360badb37fb1f18fc8d4136827fcdc2e233f5b7))
* **core:** fix normalizeDOMPoint to do better job ([#4048](https://github.com/worktile/slate-angular/issues/4048)) ([cfa0088](https://github.com/worktile/slate-angular/commit/cfa0088aec7610c4d78de0939afa78273d2a9fa2))
* **core:** fixed an issue with controlled value messing up editor.selection ([e3b7a08](https://github.com/worktile/slate-angular/commit/e3b7a08fefdafa0b1492c9017aa7e865d9988842))
* **core:** fixed converting querySelectorAll results to array ([ea58e3f](https://github.com/worktile/slate-angular/commit/ea58e3f1aaf61e3b6fb93c700258ab23c745db42))
* **demo:** fix Type Error ([7d43290](https://github.com/worktile/slate-angular/commit/7d4329081f6196cf506aa8ee48ba94873d302f0d))
* **types:** define ret type ([58b93ec](https://github.com/worktile/slate-angular/commit/58b93ecc68efbf7788f263f77b8fd5a2797e3e9f))

### [1.0.3](https://github.com/worktile/slate-angular/compare/v1.0.2...v1.0.3) (2021-05-27)


### Bug Fixes

* **browser:** fix cursor move warn for qq browser ([ace5697](https://github.com/worktile/slate-angular/commit/ace56976672a5c0501209c5686f654c0541bce8c))

### [1.0.2](https://github.com/worktile/slate-angular/compare/v1.0.1...v1.0.2) (2021-05-27)


### Features

* **demo:** add image demo #WIK-563 ([2beefb1](https://github.com/worktile/slate-angular/commit/2beefb1b647a17c221b25b91fbfaf43bad01321e)), closes [#WIK-563](https://github.com/worktile/slate-angular/issues/WIK-563)
* **demo:** add search highlighting ([faa76e6](https://github.com/worktile/slate-angular/commit/faa76e61d3ded9e931cc99e294d6d11e7f1f8736))
* **demo:** add table demo #WIK-697 ([925674b](https://github.com/worktile/slate-angular/commit/925674becef0581d418e954bd049b62777d99819)), closes [#WIK-697](https://github.com/worktile/slate-angular/issues/WIK-697)
* **demo:** adjust demo style ([622b5a6](https://github.com/worktile/slate-angular/commit/622b5a6a8074948c9faaa88ac81207b53b867fa8))
* **demo:** remove click ([6fdd599](https://github.com/worktile/slate-angular/commit/6fdd599cb6aab1d12b2a7c58babe9cc1935596fd))


### Bug Fixes

* **demo:** fix change method ([135df58](https://github.com/worktile/slate-angular/commit/135df5847cf7d671ab7a2446fd83033e6569974a))
* **view:** catch the invalid data range ([e6201d7](https://github.com/worktile/slate-angular/commit/e6201d7b3a7e1795606a1f39aa70e678673c618e))

### [1.0.1](https://github.com/worktile/slate-angular/compare/v1.0.0...v1.0.1) (2021-05-27)


### Features

* **core:** add trackby and update README ([3fc5240](https://github.com/worktile/slate-angular/commit/3fc5240329dd8b5df368260e9c26ab83481ee192))

## [1.0.0](https://github.com/worktile/slate-angular/compare/v0.53.3...v1.0.0) (2021-05-27)


### Features

* **view:** refactor angular view render ([40a636a](https://github.com/worktile/slate-angular/commit/40a636a7f9a86aa6a93fb583a787c6c67fd41fb7))


### Bug Fixes

* **core:** avoid merge the empty text #WIK-3805 ([3206b1a](https://github.com/worktile/slate-angular/commit/3206b1a6b35d03a15c2e1e113c4d5681b0a5e335)), closes [#WIK-3805](https://github.com/worktile/slate-angular/issues/WIK-3805)

### [0.53.4](https://github.com/worktile/slate-angular/compare/v0.53.3...v0.53.4) (2021-05-27)


### Bug Fixes

* **core:** avoid merge the empty text #WIK-3805 ([3206b1a](https://github.com/worktile/slate-angular/commit/3206b1a6b35d03a15c2e1e113c4d5681b0a5e335)), closes [#WIK-3805](https://github.com/worktile/slate-angular/issues/WIK-3805)

### [0.53.3](https://github.com/worktile/slate-angular/compare/v0.53.2...v0.53.3) (2021-04-22)


### Bug Fixes

* **core:** fix throw error when selectionchange #WIK-3788 ([881b65a](https://github.com/worktile/slate-angular/commit/881b65ab5cb671dd8a1b28d321040b20f97cabda)), closes [#WIK-3788](https://github.com/worktile/slate-angular/issues/WIK-3788)
* **core:** modify card-right offset to -2 ([143adad](https://github.com/worktile/slate-angular/commit/143adad48d2717fa30eb033f528d6d92cd953b97))

### [0.53.2](https://github.com/worktile/slate-angular/compare/v0.53.1...v0.53.2) (2021-04-22)


### Features

* **core:** add logic to correct DOMSelection #WIK-3786 ([75cdb90](https://github.com/worktile/slate-angular/commit/75cdb90df74e8f2386546597edf22911eac643e1)), closes [#WIK-3786](https://github.com/worktile/slate-angular/issues/WIK-3786)


### Bug Fixes

* **core:** call deleteFragment before paste to avoid invalid data  #WIK-3784 ([24d4c25](https://github.com/worktile/slate-angular/commit/24d4c258d9af6333ea60b088a89e668d7978514e)), closes [#WIK-3784](https://github.com/worktile/slate-angular/issues/WIK-3784)
* **plugin:** add isFocusedPath to ensure selection is on the text WIK-3762 ([#28](https://github.com/worktile/slate-angular/issues/28)) ([006d3f8](https://github.com/worktile/slate-angular/commit/006d3f89b99d17b2eef650bd63dfb856bf6e5bb2))

### [0.53.1](https://github.com/worktile/slate-angular/compare/v0.53.0...v0.53.1) (2021-04-21)


### Features

* **core:** support custom clipboard format key  #WIK-3782 ([3e8a832](https://github.com/worktile/slate-angular/commit/3e8a832a7c9247acd76cf4ebf35fa7573411b096)), closes [#WIK-3782](https://github.com/worktile/slate-angular/issues/WIK-3782)


### Bug Fixes

* **block-card:** fix forward set path error #WIK-3779 ([2619ff5](https://github.com/worktile/slate-angular/commit/2619ff54a3626164333fd3d504b3392f072afb63)), closes [#WIK-3779](https://github.com/worktile/slate-angular/issues/WIK-3779)
* **block-card:** fix get cursor error ([e6a2d61](https://github.com/worktile/slate-angular/commit/e6a2d61a98befd04df197f09b0e52b3b0a47707c))

## [0.53.0](https://github.com/worktile/slate-angular/compare/v0.52.0...v0.53.0) (2021-04-19)


### Bug Fixes

* **core:** support the expand range for card-left/card-center/card-right ([953be38](https://github.com/worktile/slate-angular/commit/953be385e55e34cfad7ee4c15cc7b7a54a93025d))

## [0.52.0](https://github.com/worktile/slate-angular/compare/v0.51.0...v0.52.0) (2021-04-19)


### Features

* **core:** suport slate selection for block card ([9c1591b](https://github.com/worktile/slate-angular/commit/9c1591b669bbc15a922534e3cc1babae9fec268d))


### Bug Fixes

* **browser:** compat firefox fire twice composition end #WIK-3760 ([f377954](https://github.com/worktile/slate-angular/commit/f3779545d34239b9fadb7b076514a23169ba92c2)), closes [#WIK-3760](https://github.com/worktile/slate-angular/issues/WIK-3760)

### [0.51.1](https://github.com/worktile/slate-angular/compare/v0.51.0...v0.51.1) (2021-04-15)


### Bug Fixes

* **browser:** compat firefox fire twice composition end #WIK-3760 ([f377954](https://github.com/worktile/slate-angular/commit/f3779545d34239b9fadb7b076514a23169ba92c2)), closes [#WIK-3760](https://github.com/worktile/slate-angular/issues/WIK-3760)

## [0.51.0](https://github.com/worktile/slate-angular/compare/v0.50.3...v0.51.0) (2021-04-13)


### Bug Fixes

* **core:** refactor ng model and fix test error ([3ab7cc1](https://github.com/worktile/slate-angular/commit/3ab7cc108d08098fd4c68ec81a2b86131738dc5d))

### [0.50.3](https://github.com/worktile/slate-angular/compare/v0.50.2...v0.50.3) (2021-04-12)


### Bug Fixes

* **core:** fix componentRef rootNodes ([9ee7466](https://github.com/worktile/slate-angular/commit/9ee746627293490f85a15bf2acbba67c5672cfd2))

### [0.50.2](https://github.com/worktile/slate-angular/compare/v0.50.1...v0.50.2) (2021-04-12)


### Bug Fixes

* **core:** call onChangeCallback after reRender ([e156610](https://github.com/worktile/slate-angular/commit/e1566102eeebb3c4ce696f45351b287bf166570b))

### 0.50.1 (2021-04-12)


### Features

* **config:** update config ([8712d51](https://github.com/worktile/slate-angular/commit/8712d5130c750b96a9766ffc642e717d2da9784f))
* **core:** init slate-angular ([a141fd4](https://github.com/worktile/slate-angular/commit/a141fd49db51c45c27a1fe9c13eb2efeab65b5eb))
* **core:** support rootNodes ([6021de3](https://github.com/worktile/slate-angular/commit/6021de369550b3c15822062ff55a68254622e4b2))


### Bug Fixes

* **core:** fix format code bug #WIK-3715 ([74bd53b](https://github.com/worktile/slate-angular/commit/74bd53b5c7399adba315cd75e897abf1b43d84a4)), closes [#WIK-3715](https://github.com/worktile/slate-angular/issues/WIK-3715)
* **core:** set empty paragraph when empty value #INFR-1790 ([6450e76](https://github.com/worktile/slate-angular/commit/6450e7609d3d2f4c333056850c18af87228b7cf8)), closes [#INFR-1790](https://github.com/worktile/slate-angular/issues/INFR-1790)
* **template:** prevent selectionchange when IME between 'aa\n' and '\n' #WIK-3703 ([2e538c5](https://github.com/worktile/slate-angular/commit/2e538c5535d87a8022579a1ea6344181fe069ca3)), closes [#WIK-3703](https://github.com/worktile/slate-angular/issues/WIK-3703)
