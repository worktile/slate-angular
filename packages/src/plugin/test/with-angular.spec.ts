import { async, tick, fakeAsync } from '@angular/core/testing';
import { createEditor, Editor, Transforms } from 'slate';
import { withAngular } from '../with-angular';
import { EDITOR_TO_ON_CHANGE } from '../../utils/weak-maps';
import { AngularEditor } from '../angular-editor';

describe('with-angular', () => {
    let editor;
    let angularEditor;
    function configEditor() {
        editor = createEditor();
        angularEditor = withAngular(editor);
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
        it('custom onChange was called', fakeAsync(() => {
            let isOnChanged = false;
            EDITOR_TO_ON_CHANGE.set(editor, () => {
                isOnChanged = true;
            });
            Transforms.select(editor, {
                anchor: {
                    path: [0, 0],
                    offset: 0
                },
                focus: {
                    path: [0, 0],
                    offset: 3
                }
            });
            tick(1000);
            expect(isOnChanged).toBeTruthy();
        }));
        it('default OnChange was called', fakeAsync(() => {
            spyOn(editor, 'onChange').and.callThrough();
            Transforms.select(editor, {
                anchor: {
                    path: [0, 0],
                    offset: 0
                },
                focus: {
                    path: [0, 0],
                    offset: 3
                }
            });
            tick(1000);
            expect(editor.onChange).toHaveBeenCalled();
        }));
    });
    describe('insertData', () => {
    });
});
