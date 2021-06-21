# slate-angular

[![CircleCI](https://circleci.com/gh/worktile/slate-angular.svg?style=shield)](https://circleci.com/gh/worktile/slate-angular)
[![Coverage Status][coveralls-image]][coveralls-url]
[![npm (scoped)](https://img.shields.io/npm/v/slate-angular?style=flat)](https://www.npmjs.com/package/slate-angular)
[![npm](https://img.shields.io/npm/dm/slate-angular)](https://www.npmjs.com/package/slate-angular)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/slate-angular)

[coveralls-image]: https://coveralls.io/repos/github/worktile/slate-angular/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/worktile/slate-angular

Angular view layer for Slate

[中文文档](https://github.com/worktile/slate-angular/blob/master/README.zh-CN.md)


## Introduction

[Slate](https://github.com/ianstormtaylor/slate) is a completely customizable framework for building rich text editors, including the model layer and view layer, but the slate only provides the view layer based on react, slate-angular is a supplement to the slate view layer, to help you use angular to build rich text editor.

Slate-angular is inspired by slate-react, and try to keep the style of slate and angular, friendly to Chinese input, start your slate-angular journey.


## Demo

[Try out our live demo](http://slate-angular.ngnice.com)

![editor-preview.png](https://cdn.worktile.com/open-sources/slate-angular/editor-preview.gif)


## Feature

- Support element front and rear cursor scheme
- Support custom component/template rendering Element
- Support custom component/template to render Text
- Support custom component/template rendering Leaf
- Support decorate decoration
- Support void element

### Compatible browser

Chrome、Edge、Safari、Firefox、QQ Browser


## Who is using slate-angular?

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

### Prerequisites

Angular >= 10.*

Slate >= 0.63.0


## Contributing

🌟 Stars and 📥 Pull requests to worktile/slate-angular are welcome! 


## LICENSE

[MIT License](https://github.com/worktile/slate-angular/blob/master/LICENSE)
