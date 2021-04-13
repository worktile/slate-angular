import { ComponentFixture, TestBed, tick, fakeAsync, flush } from '@angular/core/testing';
import { Component, ViewChild, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
import { createEditor, Transforms, Editor } from 'slate';
import { SlateModule } from '../../slate.module';
import { SlaEditableComponent } from './editable.component';
import { withAngular } from '../../plugins/with-angular';
import { ELEMENT_TO_NODE, EDITOR_TO_ELEMENT, NODE_TO_ELEMENT, EDITOR_TO_ON_CHANGE } from '../../utils/weak-maps';
import { dispatchKeyboardEvent } from '../../testing';
import { Z } from '@angular/cdk/keycodes';
import { withHistory } from 'slate-history';
import { IS_APPLE } from '../../utils/environment';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { SlaComponentBase } from '../../core';
import { ViewElementContext } from '../../interfaces/view-node';
import { AngularEditor } from '../../plugins/angular-editor';
import { FormsModule } from '@angular/forms';

describe('SlaEditableComponent', () => {
    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [BasicComponent, SlateCoreComponent, DynamicComponent, Dynamic2Component, BasicOriginComponent],
            imports: [SlateModule, FormsModule]
        })
            .overrideModule(BrowserDynamicTestingModule, {
                set: {
                    entryComponents: [DynamicComponent, Dynamic2Component]
                }
            })
            .compileComponents();
    }));

    describe('origin', () => {
        let component: BasicOriginComponent;
        let fixture: ComponentFixture<BasicOriginComponent>;
        beforeEach(fakeAsync(() => {
            fixture = TestBed.createComponent(BasicOriginComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        }));
        it('should create', () => {
            expect(component.editableComponent).toBeTruthy();
        });

        it('should set slate attr on host view', () => {
            expect(
                (component.editableComponent.elementRef.nativeElement as HTMLElement).attributes.getNamedItem(
                    'data-slate-node'
                ).value
            ).toEqual('value');
            expect(
                (component.editableComponent.elementRef.nativeElement as HTMLElement).attributes.getNamedItem(
                    'data-slate-editor'
                ).value
            ).toEqual('true');
        });

        it('should set EDITOR_TO_ELEMENT/NODE_TO_ELEMENT/ELEMENT_TO_NODE', () => {
            expect(EDITOR_TO_ELEMENT.get(component.editor)).toEqual(component.editableComponent.elementRef.nativeElement);
            expect(NODE_TO_ELEMENT.get(component.editor)).toEqual(component.editableComponent.elementRef.nativeElement);
            expect(ELEMENT_TO_NODE.get(component.editableComponent.elementRef.nativeElement)).toEqual(component.editor);
        });

        it('should emit slaKeyDown when type in editable', () => {
            const spy = jasmine.createSpy('slaKeyDown-preventDefault');
            const editableElement = EDITOR_TO_ELEMENT.get(component.editor);
            component.keyDownCallback = event => {
                spy();
            };
            dispatchKeyboardEvent(editableElement, 'keydown', Z, 'z', editableElement, { meta: true });
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('should undo when press command + z', fakeAsync(() => {
            const spy = jasmine.createSpy('slaKeyDown-preventDefault');
            const editableElement = EDITOR_TO_ELEMENT.get(component.editor);
            Transforms.select(component.editor, {
                anchor: {
                    path: [0, 0],
                    offset: 16
                },
                focus: {
                    path: [0, 0],
                    offset: 16
                }
            });

            const insertText = ' new text';
            Transforms.insertText(component.editor, insertText);
            expect(Editor.string(component.editor, [0, 0])).toBe(component.value[0].children[0].text + insertText);
            if (IS_APPLE) {
                dispatchKeyboardEvent(editableElement, 'keydown', Z, 'z', editableElement, { meta: true });
            } else {
                dispatchKeyboardEvent(editableElement, 'keydown', Z, 'z', editableElement, { control: true });
            }
            tick(1000);
            expect(Editor.string(component.editor, [0, 0])).toBe(component.value[0].children[0].text);
        }));

        it('should prevent to undo when call event.preventDefault() in slaKeyDown', fakeAsync(() => {
            const spy = jasmine.createSpy('slaKeyDown-preventDefault');
            const editableElement = EDITOR_TO_ELEMENT.get(component.editor);
            Transforms.select(component.editor, {
                anchor: {
                    path: [0, 0],
                    offset: 16
                },
                focus: {
                    path: [0, 0],
                    offset: 16
                }
            });

            const insertText = ' new text';
            Transforms.insertText(component.editor, insertText);
            component.keyDownCallback = (event: KeyboardEvent) => {
                event.preventDefault();
            };
            dispatchKeyboardEvent(editableElement, 'keydown', Z, 'z', editableElement, { meta: true });
            tick(1000);
            expect(Editor.string(component.editor, [0, 0])).toBe(component.value[0].children[0].text);
        }));
    })

    describe('basic', () => {
        let component: BasicComponent;
        let fixture: ComponentFixture<BasicComponent>;
        beforeEach(fakeAsync(() => {
            fixture = TestBed.createComponent(BasicComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        }));

        it('should create', () => {
            expect(component.slateComponent).toBeTruthy();
        });

        it('should set children property of editor', () => {
            expect(component.slateComponent.editor.children).toBe(component.value);
        });

        it('should sync editor value when component value change', fakeAsync(() => {
            component.value = [{
                type: 'paragraph',
                children: [{ text: 'This is another editable' }]
            }];
            fixture.detectChanges();
            tick(1000);
            expect(component.slateComponent.editor.children).toBe(component.value);
        }));

        it('should sync component value when editor value change', fakeAsync(() => {
            const insertText = ' another text'
            Transforms.select(component.editor, {
                anchor: {
                    path: [0, 0],
                    offset: 16
                },
                focus: {
                    path: [0, 0],
                    offset: 16
                }
            });
            Transforms.insertText(component.editor, insertText);
            tick(1000);
            expect(component.value).toBe(component.slateComponent.editor.children as []);
        }));

        it('should set EDITOR_TO_ON_CHANGE', () => {
            expect(EDITOR_TO_ON_CHANGE.get(component.editor)).toBeTruthy();
        });

        it('should emit valueChange event when value change', fakeAsync(() => {
            Transforms.select(component.editor, {
                anchor: {
                    path: [0, 0],
                    offset: 4
                },
                focus: {
                    path: [0, 0],
                    offset: 4
                }
            });
            tick(1000);
            expect(component.valueChangeSpy).toHaveBeenCalledTimes(1);
        }));

    });

    describe('core', () => {
        let component: SlateCoreComponent;
        let fixture: ComponentFixture<SlateCoreComponent>;
        beforeEach(fakeAsync(() => {
            fixture = TestBed.createComponent(SlateCoreComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            flush();
            fixture.detectChanges();
        }));

        it('should update dynamic component when reset value', fakeAsync(() => {
            expect((fixture.debugElement.nativeElement as HTMLElement).innerText).toContain('dynamic');
            const text = 'update dynamic';
            const editorData: any = [
                {
                    type: 'dynamic',
                    content: text,
                    children: [
                        {
                            text: ''
                        }
                    ]
                }
            ];
            component.value = editorData;
            fixture.detectChanges();
            flush();
            fixture.detectChanges();
            const currentText = (fixture.debugElement.nativeElement as HTMLElement).innerText;
            expect(currentText).toContain(text);
        }));

        it('should switch dynamic component', fakeAsync(() => {
            const date = '2021-01-13';
            const editorData: any = [
                {
                    type: 'dynamic2',
                    date,
                    children: [
                        {
                            text: ''
                        }
                    ]
                }
            ];
            component.value = editorData;
            fixture.detectChanges();
            flush();
            fixture.detectChanges();
            const currentText = (fixture.debugElement.nativeElement as HTMLElement).innerText;
            expect(currentText).toContain(date);
        }));

        it('should update template when reset value', fakeAsync(() => {
            component.value = [
                {
                    type: 'paragraph',
                    children: [{ text: '' }]
                }
            ];
            fixture.detectChanges();
            flush();
            fixture.detectChanges();
            expect((fixture.debugElement.nativeElement as HTMLElement).innerText).toContain('');

            const text = 'update&nbsp;text&nbsp;content';
            expect((fixture.debugElement.nativeElement as HTMLElement).innerText).not.toContain(text);
            component.value = [
                {
                    type: 'paragraph',
                    children: [{ text }]
                }
            ];
            fixture.detectChanges();
            flush();
            fixture.detectChanges();
            const currentText = (fixture.debugElement.nativeElement as HTMLElement).innerText;
            expect(currentText.replace(/\s/g, '&nbsp;')).toContain(text);
        }));
    });

});

@Component({
    selector: 'basic-slate',
    template: `
        <sla-editable class="demo-slate-angular-editor" [editor]="editor" [(ngModel)]="value" (ngModelChange)="valueChangeSpy()">
        </sla-editable>
    `
})
class BasicComponent {
    editor = withAngular(createEditor());
    value = [{
        type: 'paragraph',
        children: [{ text: 'This is editable' }]
    }];

    @ViewChild(SlaEditableComponent, { static: true })
    slateComponent: SlaEditableComponent;


    valueChangeSpy = jasmine.createSpy('valueChange callback');

    constructor() { }
}

const withDynamic = (editor: AngularEditor): AngularEditor => {
    const { isVoid } = editor;
    editor.isVoid = element => (element.type === 'dynamic' ? true : isVoid(element));
    return editor;
};

const withDynamic2 = (editor: AngularEditor): AngularEditor => {
    const { isVoid } = editor;
    editor.isVoid = element => (element.type === 'dynamic2' ? true : isVoid(element));
    return editor;
};

@Component({
    selector: 'dynamic, [dynamic]',
    template: `
        <span contenteditable="false">{{ element.content }}</span>
        <sla-nest-children-entry [children]="children"></sla-nest-children-entry>
    `
})
export class DynamicComponent extends SlaComponentBase implements OnInit, OnDestroy {

    @Input()
    set context(value: ViewElementContext) {
        this.setContext(value);
    }

    constructor(public elementRef: ElementRef) {
        super(elementRef);
    }

    ngOnInit(): void {
        super.init();
    }

    ngOnDestroy(): void {
        super.destroy();
    }
}

@Component({
    selector: 'dynamic2, [dynamic2]',
    template: `
        <span contenteditable="false">{{ element.date }}</span>
        <sla-nest-children-entry [children]="children"></sla-nest-children-entry>
    `
})
export class Dynamic2Component extends SlaComponentBase implements OnInit, OnDestroy {

    @Input()
    set context(value: ViewElementContext) {
        this.setContext(value);
    }

    constructor(public elementRef: ElementRef) {
        super(elementRef);
    }

    ngOnInit(): void {
        super.init();
    }

    ngOnDestroy(): void {
        super.destroy();
    }
}

@Component({
    selector: 'sla-core-slate',
    template: `
        <sla-editable class="demo-slate-angular-editor" [editor]="editor" [(ngModel)]="value"  [renderElement]="renderElement">
        </sla-editable>
    `
})
class SlateCoreComponent implements OnInit {
    editor = withAngular(createEditor());

    value: any = [
        {
            type: 'dynamic',
            content: 'dynamic',
            children: [
                {
                    text: ''
                }
            ]
        }
    ];

    plugins: ((editor: AngularEditor) => AngularEditor)[] = [withDynamic, withDynamic2];

    @ViewChild(SlaEditableComponent, { static: true })
    slateComponent: SlaEditableComponent;

    @ViewChild(SlaEditableComponent, { static: true })
    editableComponent: SlaEditableComponent;

    constructor() { }

    ngOnInit(): void {
        this.plugins.reduce((prevEditor, nextEditor) => nextEditor(prevEditor), this.editor);
    }

    renderElement = (element: any) => {
        if (element.type === 'dynamic') {
            return DynamicComponent;
        }
        if (element.type === 'dynamic2') {
            return Dynamic2Component;
        }
        return null;
    };
}




@Component({
    selector: 'basic-editable',
    template: `
        <sla-editable class="demo-slate-angular-editor" [editor]="editor" [(ngModel)]="value" [slaKeyDown]="slaKeyDown()">
        </sla-editable>
    `
})
class BasicOriginComponent {
    editor = withAngular(withHistory(createEditor()));
    value = [
        {
            type: 'paragraph',
            children: [{ text: 'This is editable' }]
        }
    ];

    @ViewChild(SlaEditableComponent, { static: true })
    editableComponent: SlaEditableComponent;

    keyDownCallback: (event) => void;

    constructor() { }

    slaKeyDown() {
        return (event: KeyboardEvent) => {
            if (this.keyDownCallback) {
                this.keyDownCallback(event);
            }
        };
    }
}
