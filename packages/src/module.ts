import { forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlateEditable } from './components/editable/editable.component';
import { SlateDefaultText } from './components/text/default-text.component';
import { SlateVoidText } from './components/text/void-text.component';
import { SlateElement } from './components/element/element.component';
import { SlateDefaultElement } from './components/element/default-element.component';
import { SlateString } from './components/string/string.component';
import { SlateStringTemplate } from './components/string/template.component';
import { SlateDescendant } from './components/descendant/descendant.component';
import { SlateChildren } from './components/children/children.component';
import { SlateBlockCard } from './components/block-card/block-card.component';
import { SlateLeaf } from './components/leaf/leaf.component';
import { SlateDefaultLeaf } from './components/leaf/default-leaf.component';
import { SlateLeaves } from './components/leaves/leaves.component';
import { SLATE_DEFAULT_ELEMENT_COMPONENT_TOKEN } from './components/element/default-element.component.token';
import { SlateDefaultString } from './components/string/default-string.component';
import { SLATE_DEFAULT_TEXT_COMPONENT_TOKEN, SLATE_DEFAULT_VOID_TEXT_COMPONENT_TOKEN } from './components/text/token';

@NgModule({
    imports: [
        CommonModule,
        SlateEditable,
        SlateDefaultElement,
        SlateElement,
        SlateVoidText,
        SlateDefaultText,
        SlateString,
        SlateStringTemplate,
        SlateDescendant,
        SlateChildren,
        SlateBlockCard,
        SlateLeaf,
        SlateLeaves,
        SlateDefaultLeaf,
        SlateDefaultString
    ],
    exports: [
        SlateEditable,
        SlateChildren,
        SlateElement,
        SlateLeaves,
        SlateString,
        SlateDefaultString
    ]
})
export class SlateModule {}
