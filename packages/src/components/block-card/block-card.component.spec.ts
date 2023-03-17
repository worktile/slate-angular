import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ImageEditableComponent, configureBasicEditableTestingModule } from '../../testing';

describe('Block Card Component', () => {
    let component: ImageEditableComponent;
    let fixture: ComponentFixture<ImageEditableComponent>;

    beforeEach(fakeAsync(() => {
        configureBasicEditableTestingModule([ImageEditableComponent]);
        fixture = TestBed.createComponent(ImageEditableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
    }));

    it('The block-card component should be created', fakeAsync(() => {
        let blockCardElement: HTMLElement;
        blockCardElement = fixture.debugElement.query(By.css('.slate-block-card')).nativeElement;
        expect(blockCardElement).toBeTruthy();
    }));
});
