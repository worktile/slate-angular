import {
    Component,
    ChangeDetectionStrategy,
    ViewChild,
    TemplateRef,
    Input
} from '@angular/core';
import { Editor, Text } from 'slate';
import { ViewNode, ViewText } from '../../interfaces/view-node';

@Component({
    selector: 'sla-template,[slaTemplate]',
    templateUrl: 'template.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlaTemplateComponent {
    ViewText = ViewText;

    @Input()
    editor: Editor;

    @Input()
    renderMark: (text: Text) => { rootDOM: HTMLElement; deepestDOM: HTMLElement };
    
    @ViewChild('paragraph', { read: TemplateRef, static: true })
    paragraphTemplate: TemplateRef<any>;

    @ViewChild('text', { read: TemplateRef, static: true })
    textTemplate: TemplateRef<any>;

    @ViewChild('voidText', { read: TemplateRef, static: true })
    voidTextTemplate: TemplateRef<any>;
}
