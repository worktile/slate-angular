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


## Usage
### 1. 安装依赖

```
"dependencies": {
    "debug": "^4.1.1",
    "direction": "^1.0.3",
    "is-hotkey": "^0.1.6",
    "slate": "0.67.1",
    "slate-history": "0.62.0",
    "slate-angular": "1.6.5"
}
```

### 2. 导入 SlateModule 模块

```
import { FormsModule } from '@angular/forms';
import { SlateModule } from 'slate-angular';

@NgModule({
  imports: [
    // ...,
    FormsModule,
    SlateModule
  ],
  // ...
})
export class AppModule { }
```

### 3. 导入基础样式文件

src/styles.scss

```
@use 'slate-angular/styles/index.scss';

// basic richtext styles
.slate-editable-container {
    [slate-underlined][slate-strike] {
        text-decoration: underline line-through;
    }
    [slate-strike] {
        text-decoration: line-through;
    }
    [slate-underlined] {
        text-decoration: underline;
    }
    [slate-italic] {
        font-style: italic;
    }
    [slate-bold] {
        font-weight: bold;
    }
    [slate-code-line] {
        margin: 0 4px;
        padding: 2px 3px;
        border: 1px solid rgba($color: #000000, $alpha: 0.08);
        border-radius: 2px;
        background-color: rgba($color: #000000, $alpha: 0.06);
    }

    blockquote {
        margin: 0;
        margin-left: 0;
        margin-right: 0;
        color: #888;
        padding-left: 10px !important;
        border-left: 4px solid #eee;
    }
    
    h1,h2,h3 {
        margin: 0px;
    }

    &>[data-slate-node="element"],&>slate-block-card {
        margin-bottom: 12px;
    }
}

// basic richtext container styles
.demo-richtext-container {
    max-width: 42em;
    margin: 50px auto;
    background-color: #fff;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);
}
```

### 4. 添加本文标记组件

```
import { ChangeDetectorRef, Component, ElementRef, Renderer2 } from "@angular/core";
import { BaseTextComponent } from "slate-angular";

export enum MarkTypes {
    bold = 'bold',
    italic = 'italic',
    underline = 'underlined',
    strike = 'strike',
    code = 'code-line'
}

@Component({
    selector: 'span[textMark]',
    template: `<slate-leaves [context]="context" [viewContext]="viewContext" [viewContext]="viewContext"></slate-leaves>`,
    host: {
        'data-slate-node': 'text'
    }
})
export class DemoTextMarkComponent extends BaseTextComponent {
    attributes: string[] = [];

    constructor(public elementRef: ElementRef, public renderer2: Renderer2, cdr: ChangeDetectorRef) {
        super(elementRef, cdr);
    }
    
    applyTextMark() {
        this.attributes.forEach(attr => {
            this.renderer2.removeAttribute(this.elementRef.nativeElement, attr);
        });
        this.attributes = [];
        for (const key in this.text) {
            if (Object.prototype.hasOwnProperty.call(this.text, key) && key !== 'text') {
                const attr = `slate-${key}`;
                this.renderer2.setAttribute(this.elementRef.nativeElement, attr, 'true');
                this.attributes.push(attr);
            }
        }
    }

    onContextChange() {
        super.onContextChange();
        this.applyTextMark();
    }
}
```

### 5. 使用 slate-editable 组件

**Template**

```
<div class="demo-richtext-container">
    <slate-editable [editor]="editor" [(ngModel)]="value"
        (ngModelChange)="valueChange($event)"
        [renderElement]="renderElement"
        [renderText]="renderText">
        <ng-template #heading_1 let-context="context" let-viewContext="viewContext">
            <h1 slateElement [context]="context" [viewContext]="viewContext"></h1>
        </ng-template>
        <ng-template #heading_2 let-context="context" let-viewContext="viewContext">
            <h2 slateElement [context]="context" [viewContext]="viewContext"></h2>
        </ng-template>
        <ng-template #heading_3 let-context="context" let-viewContext="viewContext">
            <h3 slateElement [context]="context" [viewContext]="viewContext"></h3>
        </ng-template>
        <ng-template #blockquote let-context="context" let-viewContext="viewContext">
            <blockquote slateElement [context]="context" [viewContext]="viewContext"></blockquote>
        </ng-template>
        <ng-template #ul let-context="context" let-viewContext="viewContext">
            <ul slateElement [context]="context" [viewContext]="viewContext"></ul>
        </ng-template>
        <ng-template #ol let-context="context" let-viewContext="viewContext">
            <ol slateElement [context]="context" [viewContext]="viewContext"></ol>
        </ng-template>
        <ng-template #li let-context="context" let-viewContext="viewContext">
            <li slateElement [context]="context" [viewContext]="viewContext"></li>
        </ng-template>
    </slate-editable>
</div>
```

**TS**

```
import { Component, ViewChild, TemplateRef } from '@angular/core';
import { createEditor, Element } from 'slate';
import { withHistory } from 'slate-history';
import { withAngular } from 'slate-angular';
import { DemoTextMarkComponent, MarkTypes } from './text-mark.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  	title = 'slate-angular-basic';
    value = initialValue;

    @ViewChild('heading_1', { read: TemplateRef, static: true })
    headingOneTemplate!: TemplateRef<any>;

    @ViewChild('heading_2', { read: TemplateRef, static: true })
    headingTwoTemplate!: TemplateRef<any>;

    @ViewChild('heading_3', { read: TemplateRef, static: true })
    headingThreeTemplate!: TemplateRef<any>;

    @ViewChild('blockquote', { read: TemplateRef, static: true })
    blockquoteTemplate!: TemplateRef<any>;

    @ViewChild('ul', { read: TemplateRef, static: true })
    ulTemplate!: TemplateRef<any>;

    @ViewChild('ol', { read: TemplateRef, static: true })
    olTemplate!: TemplateRef<any>;

    @ViewChild('li', { read: TemplateRef, static: true })
    liTemplate!: TemplateRef<any>;

    editor = withHistory(withAngular(createEditor()));

    ngOnInit(): void {
    }

    valueChange(value: Element[]) {
    }

    renderElement = (element: any) => {
        if (element.type === 'heading-one') {
            return this.headingOneTemplate;
        }
        if (element.type === 'heading-two') {
            return this.headingTwoTemplate;
        }
        if (element.type === 'heading-three') {
            return this.headingThreeTemplate;
        }
        if (element.type === 'block-quote') {
            return this.blockquoteTemplate;
        }
        if (element.type === 'numbered-list') {
            return this.olTemplate;
        }
        if (element.type === 'bulleted-list') {
            return this.ulTemplate;
        }
        if (element.type === 'list-item') {
            return this.liTemplate;
        }
        return null;
    }
    
    renderText = (text: any) => {
        if (text[MarkTypes.bold] || text[MarkTypes.italic] || text[MarkTypes.code] || text[MarkTypes.underline]) {
            return DemoTextMarkComponent;
        }
      	return null;
    }
}

const initialValue = [
    {
        type: 'paragraph',
        children: [
            { text: 'This is editable ' },
            { text: 'rich', bold: true },
            { text: ' text, ' },
            { text: 'much', bold: true, italic: true },
            { text: ' better than a ' },
            { text: '<textarea>', 'code-line': true },
            { text: '!' }
        ]
    },
    {
        type: 'heading-one',
        children: [{ text: 'This is h1 ' }]
    },
    {
        type: 'heading-three',
        children: [{ text: 'This is h3 ' }]
    },
    {
        type: 'paragraph',
        children: [
            {
                text: `Since it's rich text, you can do things like turn a selection of text `
            },
            { text: 'bold', bold: true },
            {
                text: ', or add a semantically rendered block quote in the middle of the page, like this:'
            }
        ]
    },
    {
        type: 'block-quote',
        children: [{ text: 'A wise quote.' }]
    },
    {
        type: 'paragraph',
        children: [{ text: 'Try it out for yourself!' }]
    },
    {
        type: 'paragraph',
        children: [{ text: '' }]
    }
];

```



### 6. 启动

> 记得在 NgModule 中声明刚刚创建的 DemoTextMarkComponent 组件

**基础使用成功界面**

![image.png](https://atlas-rc.pingcode.com/files/public/61ac3e16e429e861587f55db)

> 现在基础使用中还没有实现工具栏，你可以根据你自己的需要引入图标库或者组件库实现工具栏.

基础使用代码仓储: [https://github.com/pubuzhixing8/slate-angular-basic](https://github.com/pubuzhixing8/slate-angular-basic)  




## 谁在使用 slate-angular?

<table style="margin-top: 20px;">
  <tr>
    <td width="160" align="center" style="padding: 20px">
      <a target="_blank" href="https://pingcode.com/product/wiki?utm_source=github-slate-angular">
        <img src="https://cdn.pingcode.com/static/portal/assets/app-icons/app-wiki-square-fill-large.svg" height="40" />
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
