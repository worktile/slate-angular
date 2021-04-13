import { ViewChild, Component } from '@angular/core';
import { withAngular } from '../with-angular';
import { createEditor, Transforms } from 'slate';
import { SlaEditableComponent } from '../../components/editable/editable.component';
import { async, TestBed, ComponentFixture, tick, fakeAsync, flush } from '@angular/core/testing';
import { SlateModule } from '../../slate.module';
import { AngularEditor } from '../angular-editor';
import { FormsModule } from '@angular/forms';

describe('AngularEditor', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SlateCoreComponent],
            imports: [SlateModule, FormsModule]
        }).compileComponents();
    }));

    describe('toDOMRange', () => {
        let component: SlateCoreComponent;
        let fixture: ComponentFixture<SlateCoreComponent>;
        beforeEach(fakeAsync(() => {
            fixture = TestBed.createComponent(SlateCoreComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            flush();
            fixture.detectChanges();
        }));

        it('should fixed cursor after zero width char when text node is empty', () => {
            Transforms.select(component.editor, {
                anchor: {
                    path: [0, 0],
                    offset: 0
                },
                focus: {
                    path: [0, 0],
                    offset: 0
                }
            });
            const nativeRange = AngularEditor.toDOMRange(component.editor, component.editor.selection);
            expect(nativeRange.startOffset).toEqual(1);
            expect(nativeRange.endOffset).toEqual(1);
        });

        it('should fixed cursor to location after inserted text when insertText', fakeAsync(() => {
            const insertText = 'test';
            Transforms.select(component.editor, {
                anchor: {
                    path: [0, 0],
                    offset: 0
                },
                focus: {
                    path: [0, 0],
                    offset: 0
                }
            });
            tick(100);
            Transforms.insertText(component.editor, insertText);
            tick(100);
            const nativeRange = AngularEditor.toDOMRange(component.editor, component.editor.selection);
            expect(nativeRange.startOffset).toEqual(insertText.length);
            expect(nativeRange.endOffset).toEqual(insertText.length);
        }));
    });
});

@Component({
    selector: 'sla-core-slate',
    template: `
        <sla-editable
            class="demo-slate-angular-editor"
            [editor]="editor"
            [(ngModel)]="value"
        >
        </sla-editable>
    `
})
class SlateCoreComponent {
    editor = withAngular(createEditor());

    value = [
        {
            type: 'paragraph',
            children: [{ text: '' }]
        }
    ];

    @ViewChild(SlaEditableComponent, { static: true })
    slaEditableComponent: SlaEditableComponent;

    @ViewChild(SlaEditableComponent, { static: true })
    editableComponent: SlaEditableComponent;

    constructor() {}
}
