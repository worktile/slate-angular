import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { ImageEditableComponent, configureBasicEditableTestingModule } from '../../testing';
import { SLATE_BLOCK_CARD_CLASS_NAME } from './block-card';

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
        blockCardElement = (fixture.debugElement.nativeNode as HTMLElement).querySelector(`.${SLATE_BLOCK_CARD_CLASS_NAME}`);
        expect(blockCardElement).toBeTruthy();
    }));
});
