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

slate-angular is inspired by slate-react, and try to keep the style of slate and angular, friendly to Chinese input, start your slate-angular journey.


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


## Usage
### 1. Install dependencies

```
"dependencies": {
    "debug": "^4.1.1",
    "direction": "^1.0.3",
    "is-hotkey": "^0.1.6",
    "slate": "0.67.1",
    "slate-history": "0.66.0",
    "slate-angular": "1.6.5"
}
```

### 2. Loading SlateModule in AppModule

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

### 3. Import index.scss

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

### 4. Add text-mark component

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

### 5. Use slate-editable component

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



### 6. Startup basic demo

> Before starting, you need to declare the DemoTextMarkComponent  component in NgModule

> You can checkout a [stackblitz implementation of the readme usage](https://stackblitz.com/edit/angular-ivy-pqofah?file=src/app/app.component.ts)

**Start the demo and you will get the following interface**

![image.png](https://atlas-rc.pingcode.com/files/public/61ac3e16e429e861587f55db)

> Currently, there is no toolbar. You need to add toolbars and processing functions according to your own icon library.

basic usage: [https://github.com/pubuzhixing8/slate-angular-basic](https://github.com/pubuzhixing8/slate-angular-basic)  




## Who is using slate-angular?

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
