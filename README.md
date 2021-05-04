# slate-angular

[![CircleCI](https://circleci.com/gh/worktile/slate-angular.svg?style=shield)](https://circleci.com/gh/worktile/slate-angular)
[![Coverage Status][coveralls-image]][coveralls-url]
[![npm (scoped)](https://img.shields.io/npm/v/@worktile/planet?style=flat)](https://www.npmjs.com/package/@worktile/planet)
[![npm](https://img.shields.io/npm/dm/@worktile/planet)](https://www.npmjs.com/package/@worktile/planet)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@worktile/planet) [![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)

[coveralls-image]: https://coveralls.io/repos/github/worktile/slate-angular/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/worktile/slate-angular

Angular view layer for [Slate](https://github.com/ianstormtaylor/slate)
[中文文档](https://github.com/worktile/slate-angular/blob/master/README.zh-CN.md)

### Introduction

[Slate](https://github.com/ianstormtaylor/slate) is a completely customizable framework for building rich text editors, including the core model and view layer, but the slate only provides the view layer based on react, slate-angular is a supplement to the slate view layer, to help you use angular to build rich text editor.

Slate-angular is inspired by slate-react, and try to keep the style of slate and angular, friendly to Chinese input, start your slate-angular journey.

### Demo

[Try out our live demo](http://planet.ngnice.com)

![ngx-planet-micro-front-end.gif](https://cdn.pingcode.com/open-sources/ngx-planet/ngx-planet-micro-front-end.gif)

### Feature

- 支持块级元素前后光标
- 支持自定义元素组件
- 支持自定义文本组件
- 支持自定义叶子组件


### Who is using slate-angular?

<table>
  <tr>
    <td width="240" align="center">
      <a target="_blank" href="https://pingcode.com/product/wiki?utm_source=github-slate-angular">
        <img src="https://cdn.pingcode.com/static/pc-charm/assets/images/logo.png?v=2.40.0" height="40"/>
        <br />
        <strong>PingCode Wiki</strong>
      </a>
    </td>
  </tr>
</table>

## 💻 Development

```bash
npm install   // Installs package dependencies
```

```bash
npm run start              // run demo
npm run build              // build new slate-angular

npm run test               // run unit tests
```
### Development scripts

Useful scripts include:

`npm install` Installs package dependencies

`​npm run start` Start Demo

`npm run build` build slate-angular library

#### Prerequisites

Angular >= 10.2.4

Slate >= 0.58.4

#### Contributing

🌟 Stars and 📥 Pull requests to worktile/slate-angular are welcome! 

## LICENSE

[MIT License](https://github.com/worktile/slate-angular/blob/master/LICENSE)
