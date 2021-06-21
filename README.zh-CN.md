# slate-angular

[![CircleCI](https://circleci.com/gh/worktile/slate-angular.svg?style=shield)](https://circleci.com/gh/worktile/slate-angular)
[![Coverage Status][coveralls-image]][coveralls-url]
[![npm (scoped)](https://img.shields.io/npm/v/slate-angular?style=flat)](https://www.npmjs.com/package/slate-angular)
[![npm](https://img.shields.io/npm/dm/slate-angular)](https://www.npmjs.com/package/slate-angular)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/slate-angular)

[coveralls-image]: https://coveralls.io/repos/github/worktile/slate-angular/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/worktile/slate-angular


基于 Slate 的 Angular 视图层


## 介绍

[Slate](https://github.com/ianstormtaylor/slate) 是一款架构良好、高扩展性的富文本编辑器框架，包括核心模型和视图层，但slate官方只提供了基于react的视图层，slate-angular 是 slate 视图层实现的补充，可帮助您使用 slate 和 angular 构建富文本编辑器。

slate-angular 以 slate-react 为灵感，并且尽量保持 slate 和 angular 各自的风格, 对中文输入友好, 开启你的 slate-angular 之旅吧。


## 示例

[Try out our live demo](http://slate-angular.ngnice.com)

![editor-preview.png](https://cdn.worktile.com/open-sources/slate-angular/editor-preview.gif)


### 功能

- 支持Element前后光标方案
- 支持自定义组件/模版渲染Element
- 支持自定义组件/模版渲染Text
- 支持自定义组件/模版渲染Leaf
- 支持decorate装饰
- 支持void元素

### 兼容浏览器

Chrome、Edge、Safari、Firefox、QQ Browser



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


## 依赖

Angular >= 10.2.4

Slate >= 0.63.0


## 贡献代码

欢迎 🌟 Stars 和 📥 Pull requests! 
