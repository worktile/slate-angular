import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { createMultipleParagraph } from '../../testing/create-document';
import {
    AdvancedEditableComponent,
    EditableWithOutletComponent,
    TestElementWithOutletComponent,
    configureBasicEditableTestingModule
} from '../../testing';
import { Editor, Transforms, Node, Element } from 'slate';
import { AngularEditor } from 'slate-angular';

describe('list-render', () => {
    describe('move nodes', () => {
        let component: AdvancedEditableComponent;
        let fixture: ComponentFixture<AdvancedEditableComponent>;
        let editor: Editor;

        beforeEach(fakeAsync(() => {
            configureBasicEditableTestingModule([AdvancedEditableComponent], []);
            fixture = TestBed.createComponent(AdvancedEditableComponent);
            component = fixture.componentInstance;
            component.value = createMultipleParagraph();
            editor = component.editor;
        }));
        it('move node from [0] to [1]', fakeAsync(() => {
            fixture.detectChanges();
            flush();
            fixture.detectChanges();
            const parent = AngularEditor.toDOMNode(editor, editor);
            Transforms.moveNodes(editor, { at: [0], to: [1] });
            fixture.detectChanges();
            flush();
            fixture.detectChanges();
            expect(Node.string(editor.children[0])).toEqual('1');
            const newP0 = parent.children.item(0) as HTMLElement;
            const newP1 = parent.children.item(1) as HTMLElement;
            expect(newP0.textContent).toEqual('1');
            expect(newP1.textContent).toEqual('0');
        }));
        it('move node from [2] to [5]', fakeAsync(() => {
            fixture.detectChanges();
            flush();
            fixture.detectChanges();
            const parent = AngularEditor.toDOMNode(editor, editor);
            Transforms.moveNodes(editor, { at: [2], to: [5] });
            fixture.detectChanges();
            flush();
            fixture.detectChanges();
            const newP5 = parent.children.item(5) as HTMLElement;
            const newP3 = parent.children.item(3) as HTMLElement;
            expect(newP5.textContent).toEqual('2');
            expect(newP3.textContent).toEqual('4');
        }));
        it('move node from [5] to [2]', fakeAsync(() => {
            fixture.detectChanges();
            flush();
            fixture.detectChanges();
            const parent = AngularEditor.toDOMNode(editor, editor);
            Transforms.moveNodes(editor, { at: [5], to: [2] });
            fixture.detectChanges();
            flush();
            fixture.detectChanges();
            const newP2 = parent.children.item(2) as HTMLElement;
            const newP5 = parent.children.item(5) as HTMLElement;
            expect(newP2.textContent).toEqual('5');
            expect(newP5.textContent).toEqual('4');
        }));
        it('move node from [5] to [0]', fakeAsync(() => {
            fixture.detectChanges();
            flush();
            fixture.detectChanges();
            const parent = AngularEditor.toDOMNode(editor, editor);
            Transforms.moveNodes(editor, { at: [5], to: [0] });
            fixture.detectChanges();
            flush();
            fixture.detectChanges();
            const newP0 = parent.children.item(0) as HTMLElement;
            const newP5 = parent.children.item(5) as HTMLElement;
            expect(newP0.textContent).toEqual('5');
            expect(newP5.textContent).toEqual('4');
        }));
    });
    describe('children-outlet', () => {
        let component: EditableWithOutletComponent;
        let fixture: ComponentFixture<EditableWithOutletComponent>;
        let editor: Editor;

        beforeEach(fakeAsync(() => {
            configureBasicEditableTestingModule([EditableWithOutletComponent], [TestElementWithOutletComponent]);
            fixture = TestBed.createComponent(EditableWithOutletComponent);
            component = fixture.componentInstance;
            editor = component.editor;
        }));

        it('should render at correct position', fakeAsync(() => {
            fixture.detectChanges();
            flush();
            fixture.detectChanges();
            const value = component.value;
            const firstRoot = AngularEditor.toDOMNode(editor, value[0]);
            expect(firstRoot.firstElementChild.textContent).toEqual('before');
            expect(firstRoot.lastElementChild.textContent).toEqual('after');
            expect(firstRoot.children.item(1).textContent).toEqual(Node.string(value[0]));
            expect(firstRoot.children.length).toEqual(3);
        }));

        it('should render at correct position when insert at [0, 0]', fakeAsync(() => {
            fixture.detectChanges();
            flush();
            fixture.detectChanges();
            const emptyElement = {
                type: 'paragraph',
                children: [{ text: 'first element' }]
            } as Element;
            Transforms.insertNodes(editor, emptyElement, { at: [0, 0] });
            fixture.detectChanges();
            flush();
            fixture.detectChanges();
            const value = component.value;
            const firstRoot = AngularEditor.toDOMNode(editor, value[0]);
            expect(firstRoot.firstElementChild.textContent).toEqual('before');
            expect(firstRoot.lastElementChild.textContent).toEqual('after');
            expect(firstRoot.children.item(1).textContent).toEqual(Node.string(value[0].children[0]));
            expect(firstRoot.children.item(2).textContent).toEqual(Node.string(value[0].children[1]));
            expect(firstRoot.children.length).toEqual(4);
        }));
    });
});
