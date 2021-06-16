import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AdvancedEditableComponent, TestingLeafComponent, configureBasicEditableTestingModule } from '../../testing';

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
        component.generateDcoreate(keywords1);
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
        testingLeaf = fixture.debugElement.query(By.css('.testing-leaf')).nativeElement;
        expect(testingLeaf).toBeTruthy();
        expect(testingLeaf.textContent).toEqual(keywords1);

        const keywords2 = 'text';
        component.generateDcoreate(keywords2);
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
});
