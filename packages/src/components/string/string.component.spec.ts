import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { AdvancedEditableComponent, TestingLeafComponent, configureBasicEditableTestingModule, dispatchFakeEvent } from '../../testing';
import { Editor, Transforms } from 'slate';

describe('Default String Render', () => {
    let component: AdvancedEditableComponent;
    let fixture: ComponentFixture<AdvancedEditableComponent>;

    beforeEach(fakeAsync(() => {
        configureBasicEditableTestingModule([AdvancedEditableComponent, TestingLeafComponent], [TestingLeafComponent]);
        fixture = TestBed.createComponent(AdvancedEditableComponent);
        component = fixture.componentInstance;
    }));

    it('should correctly render editable text', fakeAsync(() => {
        const text = `Kevin Durant`;
        component.value = [
            {
                type: 'paragraph',
                children: [{ text }],
                key: 'KD'
            }
        ];
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
        const paragraphElement = document.querySelector('[data-slate-node="element"]');
        const editableText = paragraphElement.querySelector('[editable-text]');
        expect(editableText).toBeTruthy();
        expect(editableText.getAttribute('data-slate-string')).toEqual('true');
        expect(editableText.textContent).toEqual(text);
    }));

    it('should correctly render editable text with \n', fakeAsync(() => {
        const text = `Kevin Durant
        Steve Jobs`;
        component.value = [
            {
                type: 'paragraph',
                children: [{ text }],
                key: 'KD'
            }
        ];
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
        const paragraphElement = document.querySelector('[data-slate-node="element"]');
        const editableText = paragraphElement.querySelector('[editable-text]');
        expect(editableText).toBeTruthy();
        expect(editableText.getAttribute('data-slate-string')).toEqual('true');
        expect(editableText.textContent).toEqual(text);
    }));

    it('should correctly render line break empty string', fakeAsync(() => {
        const text = ``;
        component.value = [
            {
                type: 'paragraph',
                children: [{ text }],
                key: 'KD'
            }
        ];
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
        const paragraphElement = document.querySelector('[data-slate-node="element"]');
        const editableText = paragraphElement.querySelector('[editable-text]');
        expect(editableText).toBeTruthy();
        expect(editableText.childNodes.length).toEqual(2);
        expect(editableText.firstChild.textContent).toEqual(`\uFEFF`);
        expect(editableText.lastElementChild.tagName).toEqual(`BR`);
    }));

    it('should correctly render text when text transform text from empty string to non-empty string', fakeAsync(() => {
        const text = ``;
        component.value = [
            {
                type: 'paragraph',
                children: [{ text }],
                key: 'KD'
            }
        ];
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
        const paragraphElement = document.querySelector('[data-slate-node="element"]');
        const editableText = paragraphElement.querySelector('[editable-text]');
        expect(editableText).toBeTruthy();
        expect(editableText.childNodes.length).toEqual(2);
        expect(editableText.firstChild.textContent).toEqual(`\uFEFF`);
        expect(editableText.lastElementChild.tagName).toEqual(`BR`);
        
        Transforms.select(component.editor, Editor.end(component.editor, [0]));

        const newText = 'Kevin Durant';
        Transforms.insertText(component.editor, newText);
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
        expect(editableText.childNodes.length).toEqual(1);
        expect(editableText.firstChild.textContent).toEqual(newText);
    }));

    it('should correctly render text when text transform text from non-empty string empty string', fakeAsync(() => {
        const text = `Kevin Durant`;
        component.value = [
            {
                type: 'paragraph',
                children: [{ text }],
                key: 'KD'
            }
        ];
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
        const paragraphElement = document.querySelector('[data-slate-node="element"]');
        const editableText = paragraphElement.querySelector('[editable-text]');
        expect(editableText).toBeTruthy();
        expect(editableText.childNodes.length).toEqual(1);
        expect(editableText.firstChild.textContent).toEqual(text);
        
        Transforms.select(component.editor, [0]);

        Transforms.delete(component.editor);
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
        expect(editableText.childNodes.length).toEqual(2);
        expect(editableText.firstChild.textContent).toEqual(`\uFEFF`);
        expect(editableText.lastElementChild.tagName).toEqual(`BR`);
    }));
});
