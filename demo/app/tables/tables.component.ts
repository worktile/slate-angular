import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, NgZone } from '@angular/core';
import { createEditor, Editor, Text, Element, Node } from 'slate';
import { AngularEditor, DOMElement, withAngular } from 'slate-angular';
import { MarkTypes, DemoTextMarkComponent } from '../components/text/text.component';
import { withBlockCard } from '../plugins/block-cards.plugin';
import { SlateElement } from '../../../packages/src/components/element/element.component';
import { FormsModule } from '@angular/forms';
import { SlateEditable } from '../../../packages/src/components/editable/editable.component';
import { take } from 'rxjs/operators';

@Component({
    selector: 'demo-tables',
    templateUrl: 'tables.component.html',
    standalone: true,
    imports: [SlateEditable, FormsModule, SlateElement]
})
export class DemoTablesComponent implements OnInit, AfterViewInit {
    value = getInitialTableValue();

    editor = withBlockCard(withTable(withAngular(createEditor())));

    @ViewChild('tableTemplate', { read: TemplateRef, static: true })
    tableTemplate: TemplateRef<any>;

    @ViewChild('trTemplate', { read: TemplateRef, static: true })
    trTemplate: TemplateRef<any>;

    @ViewChild('tdTemplate', { read: TemplateRef, static: true })
    tdTemplate: TemplateRef<any>;

    @ViewChild('pTemplate', { read: TemplateRef, static: true })
    pTemplate: TemplateRef<any>;

    constructor(private ngZone: NgZone) {}

    ngOnInit() {
        console.time();
    }

    ngAfterViewInit(): void {
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            console.timeEnd();
        });
    }

    renderElement() {
        return (element: any) => {
            if (element.type === 'table') {
                return this.tableTemplate;
            }
            if (element.type === 'table-row') {
                return this.trTemplate;
            }
            if (element.type === 'table-cell') {
                return this.tdTemplate;
            }
            if (element.type === 'paragraph') {
                return this.pTemplate;
            }
            return null;
        };
    }

    renderText = (text: Text) => {
        // if (text[MarkTypes.bold] || text[MarkTypes.italic] || text[MarkTypes.code] || text[MarkTypes.underline]) {
        //     return DemoTextMarkComponent;
        // }
    };

    valueChange(event) {}

    mousedown(event: MouseEvent) {
        const editableElement = AngularEditor.toDOMNode(this.editor, this.editor);
        if (event.target === editableElement) {
            const rectEditable = editableElement.getBoundingClientRect();
            const centerX = rectEditable.x + rectEditable.width / 2;
            const relativeElement = document.elementFromPoint(centerX, event.y);
            const relativeBlockCardElement: DOMElement = relativeElement.closest('.slate-block-card');
            if (relativeBlockCardElement) {
                const blockCardEntry = AngularEditor.toSlateCardEntry(this.editor, relativeBlockCardElement.firstElementChild);
                if (blockCardEntry && blockCardEntry[1]) {
                    const rootNodePath = blockCardEntry[1].slice(0, 1);
                    const rootNode = Node.get(this.editor, rootNodePath);
                    if (this.editor.isBlockCard(rootNode)) {
                        event.preventDefault();
                        AngularEditor.moveBlockCard(this.editor, rootNode, {
                            direction: event.x < centerX ? 'left' : 'right'
                        });
                    }
                }
            }
        }
    }
}

export const getInitialTableValue = () => {
    const length = 3500;
    const array = new Array(length).fill(0).map(() => {
        return {
            type: 'table-row',
            children: [
                {
                    type: 'table-cell',
                    children: [
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: '# of feet',
                                    bold: true
                                }
                            ],
                            key: 'SiTjf'
                        }
                    ],
                    key: 'AtwAH'
                },
                {
                    type: 'table-cell',
                    children: [
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: '2'
                                }
                            ],
                            key: 'EHypc'
                        }
                    ],
                    key: 'XrTFZ'
                },
                {
                    type: 'table-cell',
                    children: [
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: '4'
                                }
                            ],
                            key: 'fjdSs'
                        }
                    ],
                    key: 'XYRfj'
                },
                {
                    type: 'table-cell',
                    children: [
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: '4'
                                }
                            ],
                            key: 'yRrtk'
                        }
                    ],
                    key: 'aYejG'
                }
            ],
            key: 'JzTGH'
        };
    });
    const initialValue = [
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
                                    ],
                                    key: 'cByET'
                                }
                            ],
                            key: 'MZHwE'
                        },
                        {
                            type: 'table-cell',
                            children: [
                                {
                                    type: 'paragraph',
                                    children: [
                                        {
                                            text: 'Human',
                                            bold: true
                                        }
                                    ],
                                    key: 'cptsk'
                                }
                            ],
                            key: 'bsEhc'
                        },
                        {
                            type: 'table-cell',
                            children: [
                                {
                                    type: 'paragraph',
                                    children: [
                                        {
                                            text: 'Dog',
                                            bold: true
                                        }
                                    ],
                                    key: 'TFGzW'
                                }
                            ],
                            key: 'mbAht'
                        },
                        {
                            type: 'table-cell',
                            children: [
                                {
                                    type: 'paragraph',
                                    children: [
                                        {
                                            text: 'Cat',
                                            bold: true
                                        }
                                    ],
                                    key: 'FdjGn'
                                }
                            ],
                            key: 'RcRRZ'
                        }
                    ],
                    header: true,
                    key: 'hGprR'
                },
                ...array
            ],
            key: 'rGcGZ'
        },
        {
            type: 'paragraph',
            key: 'dFwyN',
            children: [
                {
                    text: ''
                }
            ]
        }
    ];
    return initialValue;
};

const withTable = (editor: Editor) => {
    const { isBlockCard } = editor;
    // editor.isBlockCard = (node: Node) => {
    //     if (Element.isElement(node) && node.type === 'table') {
    //         return true;
    //     }
    //     return isBlockCard(node);
    // };
    return editor;
};
