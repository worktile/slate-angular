import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AngularEditor } from 'slate-angular';
import { AdvancedEditableComponent, TestingLeafComponent, configureBasicEditableTestingModule, dispatchFakeEvent } from '../../testing';

describe('Editable Component', () => {
    let component: AdvancedEditableComponent;
    let fixture: ComponentFixture<AdvancedEditableComponent>;

    beforeEach(fakeAsync(() => {
        configureBasicEditableTestingModule([AdvancedEditableComponent, TestingLeafComponent], [TestingLeafComponent]);
        fixture = TestBed.createComponent(AdvancedEditableComponent);
        component = fixture.componentInstance;
    }));    

    it('decorate', fakeAsync(() => {
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
        let testingLeaf;
        testingLeaf= fixture.debugElement.query(By.css('.testing-leaf'));
        expect(testingLeaf).toBeFalsy();

        const keywords1 = 'text';
        component.generateDecorate(keywords1);
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
        testingLeaf = fixture.debugElement.query(By.css('.testing-leaf')).nativeElement;
        expect(testingLeaf).toBeTruthy();
        expect(testingLeaf.textContent).toEqual(keywords1);

        const keywords2 = 'text';
        component.generateDecorate(keywords2);
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
        testingLeaf = fixture.debugElement.query(By.css('.testing-leaf')).nativeElement;;
        expect(testingLeaf).toBeTruthy();
        expect(testingLeaf.textContent).toEqual(keywords2);
    }));

    it('should rerender when data reference changes', fakeAsync(() => {
        component.value = [
            {
                type: 'paragraph',
                children: [{ text: 'Stephen Curry' }],
                key: 'Curry'
            }
        ];
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
        let paragraphElement = document.querySelector('[data-slate-node="element"]');
        component.value = [
            {
                type: 'paragraph',
                children: [{ text: 'Stephen Curry' }],
                key: 'Curry'
            }
        ];
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
        let newParagraphElement = document.querySelector('[data-slate-node="element"]');
        expect(paragraphElement === newParagraphElement).toBeFalse();
    }));

    it('should not rerender when set trackBy', fakeAsync(() => {
        component.trackBy = (element) => {
            return element['key'];
        }
        component.value = [
            {
                type: 'paragraph',
                children: [{ text: 'Stephen Curry' }],
                key: 'Curry'
            }
        ];
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
        let paragraphElement = document.querySelector('[data-slate-node="element"]');
        component.value = [
            {
                type: 'paragraph',
                children: [{ text: 'Stephen Curry' }],
                key: 'Curry'
            }
        ];
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
        let newParagraphElement = document.querySelector('[data-slate-node="element"]');
        expect(paragraphElement === newParagraphElement).toBeTrue();
    }));

    it('should use default logic to show placeholder when set placeholder value',fakeAsync(()=> {
        const placeholder = 'hello world';
        component.placeholder = placeholder;
        component.value = [
            {
                type: 'paragraph',
                children: [{ text: '' }]
            }
        ];
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
        const placeholderLeaf = document.querySelector('[data-slate-placeholder="true"]');
        expect(placeholderLeaf).not.toBeNull();
        
        AngularEditor.focus(component.editor);
        const inputElement = document.querySelector('[editable-text]');
        dispatchFakeEvent(inputElement, 'compositionstart', true);
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
        let placeholderLeafWithComposition = document.querySelector('[data-slate-placeholder="true"]');
        expect(placeholderLeafWithComposition).toBeNull();
        
        // and disappear when editor has content
        component.value = [
            {
                type: 'paragraph',
                children: [{ text: 'input...' }]
            }
        ];
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
        let placeholderLeafWithContent = document.querySelector('[data-slate-placeholder="true"]');
        expect(placeholderLeafWithContent).toBeNull();
    }))
});
