import { fakeAsync, flush } from '@angular/core/testing';
import { createEditor, Transforms } from 'slate';
import { withAngular } from './with-angular';
import { EDITOR_TO_ON_CHANGE } from '../utils/weak-maps';
import { AngularEditor } from './angular-editor';

describe('with-angular', () => {
    let angularEditor: AngularEditor;
    function configEditor() {
        angularEditor = withAngular(createEditor());
        angularEditor.children = [
            {
                type: 'paragraph',
                children: [
                    { text: 'This is editable ' },
                    { text: 'rich', bold: true },
                    { text: ' text, ' },
                    { text: 'much', bold: true, italic: true },
                    { text: ' better than a ' },
                    { text: '<textarea>', code: true },
                    { text: '!' }
                ]
            }
        ];
    }
    beforeEach(() => {
        configEditor();
    });
    describe('onChange', () => {
        it('default onChange was called', fakeAsync(() => {
            spyOn(angularEditor, 'onChange').and.callThrough();
            Transforms.select(angularEditor, {
                anchor: {
                    path: [0, 0],
                    offset: 0
                },
                focus: {
                    path: [0, 0],
                    offset: 3
                }
            });
            flush();
            expect(angularEditor.onChange).toHaveBeenCalled();
        }));
        it('custom onChange was called', fakeAsync(() => {
            let isOnChanged = false;
            EDITOR_TO_ON_CHANGE.set(angularEditor, () => {
                isOnChanged = true;
            });
            Transforms.select(angularEditor, {
                anchor: {
                    path: [0, 0],
                    offset: 0
                },
                focus: {
                    path: [0, 0],
                    offset: 3
                }
            });
            flush();
            expect(isOnChanged).toBeTruthy();
        }));
    });
});
