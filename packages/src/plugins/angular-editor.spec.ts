import { TestBed, ComponentFixture, tick, fakeAsync, flush } from '@angular/core/testing';
import { AngularEditor } from './angular-editor';
import { BasicEditableComponent, configureBasicEditableTestingModule } from '../testing';
import { Transforms, Element } from 'slate';
import { createEmptyDocument } from 'slate-angular/testing/create-document';

describe('AngularEditor', () => {
    let component: BasicEditableComponent;
    let fixture: ComponentFixture<BasicEditableComponent>;

    beforeEach(fakeAsync(() => {
        configureBasicEditableTestingModule([BasicEditableComponent]);
        fixture = TestBed.createComponent(BasicEditableComponent);
        component = fixture.componentInstance;
        component.value = createEmptyDocument() as Element[];
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
    }));

    afterEach(() => {
        fixture.destroy();
    });

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

