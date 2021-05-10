# slate-angular

[![CircleCI](https://circleci.com/gh/worktile/slate-angular.svg?style=shield)](https://circleci.com/gh/worktile/slate-angular)
[![Coverage Status][coveralls-image]][coveralls-url]
[![npm (scoped)](https://img.shields.io/npm/v/@worktile/slate-angular?style=flat)](https://www.npmjs.com/package/@worktile/slate-angular)
[![npm](https://img.shields.io/npm/dm/@worktile/slate-angular)](https://www.npmjs.com/package/@worktile/slate-angular)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@worktile/slate-angular) [![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)

[coveralls-image]: https://coveralls.io/repos/github/worktile/slate-angular/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/worktile/slate-angular

基于 [Slate](https://github.com/ianstormtaylor/slate) 的 Angular 视图层


## 介绍

[Slate](https://github.com/ianstormtaylor/slate) 是一款架构良好、高扩展性的富文本编辑器框架，包括核心模型和视图层，但slate官方只提供了基于react的视图层，slate-angular 是 slate 视图层实现的补充，可帮助您使用 slate 和 angular 构建富文本编辑器。

slate-angular 以 slate-react 为灵感，并且尽量保持 slate 和 angular 各自的风格, 对中文输入友好, 开启你的 slate-angular 之旅吧。


## 示例

[Try out our live demo](http://slate-angular.ngnice.com)

![editor-preview.png](https://cdn.worktile.com/open-sources/slate-angular/editor-preview.png)


### 功能

- 支持块级元素前后光标
- 支持自定义元素组件/模板
- 支持自定义文本组件/模板
- 支持自定义叶子组件/模板


## 谁在使用 slate-angular?

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


## 💻 开发

```bash
npm install   // 安装所有依赖
```

```bash
npm run start              // 启动 demo
npm run build              // 重新构建 slate-angular

npm run test               // 执行单元测试
```


### 依赖

Angular >= 10.2.4

Slate >= 0.58.4


### 贡献代码

欢迎 🌟 Stars 和 📥 Pull requests! 
