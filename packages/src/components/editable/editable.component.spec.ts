import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { createEditor } from 'slate';
import { SlateModule } from '../../module';
import { SlateEditableComponent } from './editable.component';
import { withAngular } from '../../plugins/with-angular';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { FormsModule } from '@angular/forms';

describe('SlateEditableComponent', () => {
    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [BasicComponent],
            imports: [SlateModule, FormsModule]
        })
            .overrideModule(BrowserDynamicTestingModule, {
                set: {
                    entryComponents: []
                }
            })
            .compileComponents();
    }));

    describe('basic', () => {
        let component: BasicComponent;
        let fixture: ComponentFixture<BasicComponent>;
        beforeEach(fakeAsync(() => {
            fixture = TestBed.createComponent(BasicComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        }));

        it('should create', () => {
            expect(component.editableComponent).toBeTruthy();
        });
    });
});

@Component({
    selector: 'basic-editable',
    template: `
        <slate-editable class="demo-slate-angular-editor" [editor]="editor" [(ngModel)]="value" (ngModelChange)="ngModelChange()"></slate-editable>
    `
})
class BasicComponent {
    editor = withAngular(createEditor());
    
    value = [{
        type: 'paragraph',
        children: [{ text: 'This is editable' }]
    }];

    @ViewChild(SlateEditableComponent, { static: true })
    editableComponent: SlateEditableComponent;

    ngModelChange() {}

    constructor() { }
}
