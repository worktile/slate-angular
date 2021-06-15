import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BasicEditableComponent, AdvancedEditableComponent, TestingLeafComponent, configureBasicEditableTestingModule } from '../../testing';

describe('Editable Component', () => {
    let component: AdvancedEditableComponent;
    let fixture: ComponentFixture<AdvancedEditableComponent>;

    beforeEach(fakeAsync(() => {
        configureBasicEditableTestingModule([BasicEditableComponent, AdvancedEditableComponent, TestingLeafComponent], [TestingLeafComponent]);
        fixture = TestBed.createComponent(AdvancedEditableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
    }));    

    it('decorate', fakeAsync(() => {
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
});
