import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    Input,
    OnChanges,
    OnInit,
    ViewContainerRef
} from '@angular/core';
import { Node, Text } from 'slate';
import { ViewContainerItem } from '../../view/container-item';
import { SlateLeafContext, SlateStringContext } from '../../view/context';
import { SlateDefaultString } from './default-string.component';

@Component({
    selector: 'span[slateString]',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class SlateString extends ViewContainerItem<SlateStringContext> implements OnInit, OnChanges, AfterViewInit {
    @Input() context: SlateLeafContext;

    protected elementRef = inject<any>(ElementRef);

    protected viewContainerRef = inject(ViewContainerRef);

    ngOnInit(): void {
        this.createView();
    }

    ngOnChanges() {
        if (!this.initialized) {
            return;
        }
        this.updateView();
    }

    ngAfterViewInit() {
        this.elementRef.nativeElement.remove();
    }

    // COMPAT: If this is the last text node in an empty block, render a zero-
    // width space that will convert into a line break when copying and pasting
    // to support expected plain text.
    isLineBreakEmptyString() {
        return (
            this.context.leaf.text === '' &&
            this.context.parent.children[this.context.parent.children.length - 1] === this.context.text &&
            !this.viewContext.editor.isInline(this.context.parent) &&
            // [list-render] performance optimization: reduce the number of calls to the `Editor.string(editor, path)` method
            isEmpty(this.viewContext.editor, this.context.parent)
        );
    }

    getViewType() {
        // if (this.isVoid()) {
        //     // return this.viewContext.templateComponent.voidStringTemplate;
        // }

        // if (this.isLineBreakEmptyString()) {
        //     return SlateDefaultString;
        // }

        // if (this.isEmptyText()) {
        //     // return this.viewContext.templateComponent.emptyTextTemplate;
        // }

        // if (this.isCompatibleString()) {
        //     // return this.viewContext.templateComponent.compatibleStringTemplate;
        // }

        return SlateDefaultString;
    }

    getType(): SlateStringContext['type'] {
        if (this.isLineBreakEmptyString()) {
            return 'lineBreakEmptyString';
        }
        return 'string';
    }

    getContext(): SlateStringContext {
        const stringType = this.getType();
        return {
            text: this.context.leaf.text,
            elementStringLength: Node.string(this.context.parent).length,
            type: stringType
        };
    }

    memoizedContext(prev: SlateStringContext, next: SlateStringContext): boolean {
        return false;
    }
}

/**
 * TODO: remove when bump slate
 * copy from slate
 * @param editor
 * @param element
 * @returns
 */
export const isEmpty = (editor, element) => {
    const { children } = element;
    const [first] = children;
    return children.length === 0 || (children.length === 1 && Text.isText(first) && first.text === '' && !editor.isVoid(element));
};
