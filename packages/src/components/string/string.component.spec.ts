import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { AdvancedEditableComponent, TestingLeafComponent, configureBasicEditableTestingModule, dispatchFakeEvent } from '../../testing';

fdescribe('Default String Render', () => {
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
});
