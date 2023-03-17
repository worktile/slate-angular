import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';

@Component({
    selector: 'slate-string-template',
    templateUrl: 'template.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlateStringTemplateComponent {
    @ViewChild('stringTemplate', { read: TemplateRef, static: true })
    stringTemplate: TemplateRef<any>;

    @ViewChild('compatStringTemplate', { read: TemplateRef, static: true })
    compatStringTemplate: TemplateRef<any>;

    @ViewChild('emptyStringTemplate', { read: TemplateRef, static: true })
    emptyStringTemplate: TemplateRef<any>;

    @ViewChild('emptyTextTemplate', { read: TemplateRef, static: true })
    emptyTextTemplate: TemplateRef<any>;

    @ViewChild('lineBreakEmptyStringTemplate', {
        read: TemplateRef,
        static: true
    })
    lineBreakEmptyStringTemplate: TemplateRef<any>;
}
