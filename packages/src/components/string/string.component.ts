import {
    Component,
    OnInit,
    Input,
    HostBinding,
    ChangeDetectionStrategy,
    TemplateRef,
    OnChanges,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { Path, Node, Element as SlateElement, Editor, Text } from 'slate';
import { AngularEditor } from '../../plugins/angular-editor';
import { ViewNodeService } from '../../services/view-node.service';

@Component({
    selector: 'sla-string,[slaString]',
    templateUrl: 'string.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlaStringComponent implements OnInit, OnChanges {
    initialized = false;

    @ViewChild('stringTemplate', { static: true })
    stringTemplate: TemplateRef<any>;

    @ViewChild('zeroTemplate', { static: true })
    zeroTemplate: TemplateRef<any>;

    @Input() text: Text;
    @Input() parent: SlateElement;
    @Input() isLast: boolean;
    @Input() leaf: Text;
    @Input() editor: AngularEditor;

    context = {
        leaf: null,
        isTrailing: false,
        zeroStringLength: 0,
        isLineBreak: false
    };

    @HostBinding('attr.data-slate-leaf')
    dataSlateLeaf = true;

    contentTemplate: TemplateRef<any>;

    constructor() {}

    ngOnInit(): void {
        this.resetProperties();
        this.initialized = true;
    }

    ngOnChanges(simpleChangs: SimpleChanges) {
        if (this.initialized) {
            this.resetProperties();
        }
    }

    resetProperties() {
        this.contentTemplate = this.stringTemplate;
        this.context.isLineBreak = false;
        this.context.zeroStringLength = 0;
        this.context.isTrailing = false;
        this.context.leaf = this.leaf;

        const path = AngularEditor.findPath(this.editor, this.text);
        const parentPath = Path.parent(path);
        const parent = this.parent;

        // COMPAT: Render text inside void nodes with a zero-width space.
        // So the node can contain selection but the text is not visible.
        if (this.editor.isVoid(parent)) {
            this.contentTemplate = this.zeroTemplate;
            this.context.zeroStringLength = Node.string(parent).length;
            return;
        }

        // COMPAT: If this is the last text node in an empty block, render a zero-
        // width space that will convert into a line break when copying and pasting
        // to support expected plain text.
        if (
            this.leaf.text === '' &&
            parent.children[parent.children.length - 1] === this.text &&
            !this.editor.isInline(parent) &&
            Editor.string(this.editor, parentPath) === ''
        ) {
            this.contentTemplate = this.zeroTemplate;
            this.context.isLineBreak = true;
            return;
        }

        // COMPAT: If the text is empty, it's because it's on the edge of an inline
        // node, so we render a zero-width space so that the selection can be
        // inserted next to it still.
        if (this.leaf.text === '') {
            this.contentTemplate = this.zeroTemplate;
            return;
        }

        // COMPAT: Browsers will collapse trailing new lines at the end of blocks,
        // so we need to add an extra trailing new lines to prevent that.
        if (this.isLast && this.leaf.text.slice(-1) === '\n') {
            this.context.isTrailing = true;
            return;
        }
    }
}
