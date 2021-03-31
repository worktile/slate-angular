import { ViewNodeService } from '../view-node.service';
import { createEditor, Transforms, Editor, Element, Range, NodeEntry } from 'slate';
import { withAngular } from '../../plugins/with-angular';
import { ViewElement, ViewText } from '../../interfaces/view-node';
import { AngularEditor } from '../../plugins/angular-editor';
import { NODE_TO_PARENT } from '../../utils/weak-maps';

describe('ViewNodeService', () => {
    let viewNodeService: ViewNodeService;
    const defaultViewElements: ViewElement[] = [];
    const defaultDecorations: Range[] = [];
    const defaultDecorate: (nodeEntry: NodeEntry) => Range[] = () => [];
    let viewElements: ViewElement[];
    let editor: Editor & AngularEditor;
    beforeEach(() => {
        editor = withAngular(createEditor());
        editor.children = children;
        viewNodeService = new ViewNodeService();
        viewNodeService.initialize(editor, null, null, {} as any, defaultDecorate, false);
    });

    describe('pack', () => {
        beforeEach(() => {
            viewElements = viewNodeService.pack(defaultViewElements, defaultDecorations);
        });
        describe('core', () => {
            it('should produce relative view nodes from editor at same level', () => {
                expect(viewElements.length).toEqual(editor.children.length);
                expect(viewElements[0].context.children.length).toEqual((editor.children[0] as Element).children.length);
                expect(viewElements[1].context.element).toEqual(editor.children[1] as Element);
                expect((viewElements[1].context.children[0] as ViewText).context.text).toEqual(editor.children[1].children[0]);
                expect((viewElements[1].context.children[6] as ViewText).context.text).toEqual(editor.children[1].children[6]);
            });
            it('should immutable for view elements', () => {
                Transforms.insertNodes(editor, {
                    type: 'paragraph',
                    children: [{ text: 'new paragraph' }]
                });
                const oldViewElements = viewElements;
                const newViewElements = viewNodeService.pack(viewElements);
                expect(viewElements).toEqual(oldViewElements);
                expect(newViewElements).not.toEqual(viewElements);
            });
            it(`should change viewnode's selection when editor's element focusd`, () => {
                const selection = {
                    anchor: {
                        path: [1, 0],
                        offset: 4
                    },
                    focus: {
                        path: [1, 0],
                        offset: 4
                    }
                };
                Transforms.select(editor, selection);
                const newViewElements = viewNodeService.pack(viewElements);
                expect(newViewElements[1].context.selection).toEqual(selection);
            });
            it(`should clear viewnode's selection when editor deselect`, () => {
                const selection = {
                    anchor: {
                        path: [1, 0],
                        offset: 4
                    },
                    focus: {
                        path: [1, 0],
                        offset: 4
                    }
                };
                Transforms.select(editor, selection);
                viewElements = viewNodeService.pack(viewElements);
                expect(viewElements[1].context.selection).toEqual(selection);
                Transforms.deselect(editor);
                viewElements = viewNodeService.pack(viewElements);
                expect(viewElements[1].context.selection).toEqual(null);
            });
            describe('nested element', () => {
                beforeEach(() => {
                    const selection = {
                        anchor: {
                            path: [0, 6],
                            offset: 1
                        },
                        focus: {
                            path: [0, 6],
                            offset: 1
                        }
                    };
                    Transforms.select(editor, selection);
                    const type = 'nested-element';
                    const name = 'pubuzhixing';
                    const { isInline } = editor;
                    editor.isInline = (element: Element) => {
                        return element.type === type ? true : isInline(element);
                    };
                    const nestedElement = { type, name, children: [{ text: '' }] };
                    Transforms.insertNodes(editor, nestedElement);
                });
                it('should create view element', () => {
                    const newViewElements = viewNodeService.pack(viewElements);
                    expect(newViewElements[0].context.children[7]).toBeTruthy();
                    expect((newViewElements[0].context.children[7] as ViewElement).context.element).toEqual(editor.children[0].children[7]);
                });
                it(`should change viewnode's selection when editor's element focusd`, () => {
                    const newViewElements = viewNodeService.pack(viewElements);
                    expect((newViewElements[0].context.children[7] as ViewElement).context.selection).toBeTruthy();
                });
                it(`should clear viewnode's selection when editor deselect`, () => {
                    let newViewElements = viewNodeService.pack(viewElements);
                    Transforms.deselect(editor);
                    newViewElements = viewNodeService.pack(newViewElements);
                    expect((newViewElements[0].context.children[7] as ViewElement).context.selection).not.toBeTruthy();
                });
            });
        });
        describe('insert break', () => {
            beforeEach(() => {
                const selection = {
                    anchor: {
                        path: [0, 6],
                        offset: 1
                    },
                    focus: {
                        path: [0, 6],
                        offset: 1
                    }
                };
                Transforms.select(editor, selection);
                Editor.insertBreak(editor);
            });
            it('should produce relative view nodes from editor at same level', () => {
                const newViewElements = viewNodeService.pack(viewElements);
                expect(newViewElements.length).toEqual(editor.children.length);
                expect(newViewElements[1].context.children.length).toEqual((editor.children[1] as Element).children.length);
                expect(newViewElements[2].context.element).toEqual(editor.children[2] as any);
                expect((newViewElements[2].context.children[0] as ViewText).context.text).toEqual(editor.children[2].children[0]);
                expect((newViewElements[2].context.children[6] as ViewText).context.text).toEqual(editor.children[2].children[6]);
            });
        });
        describe('insert text', () => {
            beforeEach(() => {
                const selection = {
                    anchor: {
                        path: [1, 6],
                        offset: 0
                    },
                    focus: {
                        path: [1, 6],
                        offset: 0
                    }
                };
                Transforms.select(editor, selection);
                Transforms.insertText(editor, '1');
            });
            it('should create new view element', () => {
                const newViewElements = viewNodeService.pack(viewElements);
                expect(newViewElements[1]).not.toEqual(viewElements[1]);
                expect(newViewElements[0]).toEqual(viewElements[0]);
            });
            it('should memo element key', () => {
                const newViewElements = viewNodeService.pack(viewElements);
                expect(newViewElements[1]).not.toEqual(viewElements[1]);
                expect(newViewElements[1].key).toEqual(viewElements[1].key);
            });
            it('should create new view text', () => {
                const newViewElements = viewNodeService.pack(viewElements);
                expect(newViewElements[1]).not.toEqual(viewElements[1]);
                expect(newViewElements[1].context.children[6]).not.toEqual(viewElements[1].context.children[6]);
            });
            it('should memo text key', () => {
                const newViewElements = viewNodeService.pack(viewElements);
                expect(newViewElements[1].context.children[6].key).toEqual(viewElements[1].context.children[6].key);
            });
        });
        describe('mark', () => {});
        describe('set node', () => {
            beforeEach(() => {
                const selection = {
                    anchor: {
                        path: [1, 6],
                        offset: 1
                    },
                    focus: {
                        path: [1, 6],
                        offset: 1
                    }
                };
                Transforms.select(editor, selection);
                Transforms.setNodes(editor, { align: 'center' });
            });
            it('should create new view element', () => {
                const newViewElements = viewNodeService.pack(viewElements);
                expect(newViewElements[1]).not.toEqual(viewElements[1]);
                expect(newViewElements[0]).toEqual(viewElements[0]);
            });
            it('should memo element key', () => {
                const newViewElements = viewNodeService.pack(viewElements);
                expect(newViewElements[1]).not.toEqual(viewElements[1]);
                expect(newViewElements[1].key).toEqual(viewElements[1].key);
            });
        });
        describe('weak-maps', () => {
            beforeEach(() => {
                const selection = {
                    anchor: {
                        path: [2, 0, 0, 0, 0],
                        offset: 0
                    },
                    focus: {
                        path: [2, 0, 0, 0, 0],
                        offset: 0
                    }
                };
                Transforms.select(editor, selection);
            });
            it('should update NODE_TO_PARENT any way', () => {
                const at = [2, 0, 0];
                Transforms.setNodes(editor, { align: 'center' }, { at });
                const newViewElements = viewNodeService.pack(viewElements);
                const cellNode = editor.children[2].children[0].children[0];
                const child = cellNode.children[0];
                expect(NODE_TO_PARENT.get(child)).toEqual(cellNode);
            });
        });
    });
});
const children = [
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
    },
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
    },
    {
        type: 'table',
        children: [
            {
                type: 'table-row',
                children: [
                    {
                        type: 'table-cell',
                        children: [
                            {
                                type: 'paragraph',
                                children: [
                                    {
                                        text: ''
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                type: 'table-row',
                children: [
                    {
                        type: 'table-cell',
                        children: [
                            {
                                type: 'paragraph',
                                children: [
                                    {
                                        text: ''
                                    }
                                ]
                            }
                        ],
                        backgroundColor: '#FFFFCC'
                    }
                ]
            }
        ]
    }
];
