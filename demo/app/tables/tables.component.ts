import { Component, OnInit, ViewChild, TemplateRef, NgZone } from '@angular/core';
import { createEditor, Editor, Text, Element, Node } from 'slate';
import { AngularEditor, DOMElement, withAngular } from 'slate-angular';
import { MarkTypes, DemoTextMarkComponent } from '../components/text/text.component';
import { withBlockCard } from '../plugins/block-cards.plugin';
import { SlateElement } from '../../../packages/src/components/element/element.component';
import { FormsModule } from '@angular/forms';
import { SlateEditable } from '../../../packages/src/components/editable/editable.component';
import { ActivatedRoute, Params } from '@angular/router';
import { TableElement, TableRowElement } from 'custom-types';
import { take } from 'rxjs/operators';

@Component({
    selector: 'demo-tables',
    templateUrl: 'tables.component.html',
    standalone: true,
    imports: [SlateEditable, FormsModule, SlateElement]
})
export class DemoTablesComponent implements OnInit {
    value = [];

    editor = withBlockCard(withTable(withAngular(createEditor())));

    @ViewChild('tableTemplate', { read: TemplateRef, static: true })
    tableTemplate: TemplateRef<any>;

    @ViewChild('trTemplate', { read: TemplateRef, static: true })
    trTemplate: TemplateRef<any>;

    @ViewChild('tdTemplate', { read: TemplateRef, static: true })
    tdTemplate: TemplateRef<any>;

    constructor(private activeRoute: ActivatedRoute, private ngZone: NgZone) {}

    ngOnInit() {
        this.activeRoute.queryParams.subscribe((params: Params) => {
            const init = params['init'];
            const isHugeTable = init === 'huge-table';
            switch (init) {
                case 'huge-table':
                    this.value = [...buildOneHugeTable()];
                    break;
                default:
                    this.value = [...initialValue];
                    break;
            }
            if (isHugeTable) {
                console.time(init);
                this.ngZone.onStable.pipe(take(1)).subscribe(() => {
                    console.timeEnd(init);
                });
            }
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
            return null;
        };
    }

    renderText = (text: Text) => {
        if (text[MarkTypes.bold] || text[MarkTypes.italic] || text[MarkTypes.code] || text[MarkTypes.underline]) {
            return DemoTextMarkComponent;
        }
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

export const buildOneHugeTable = () => {
    const rowCount = 4000;
    const getRow = (index: number) => {
        const row = {
            type: 'table-row',
            children: [
                {
                    type: 'table-cell',
                    children: [
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: `${index}`
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'table-cell',
                    children: [
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: '',
                                    bold: true
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'table-cell',
                    children: [
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: '',
                                    bold: true
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'table-cell',
                    children: [
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: '',
                                    bold: true
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        return row as TableRowElement;
    };
    const table: TableElement = {
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
                                ]
                            }
                        ]
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
                                ]
                            }
                        ]
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
                                        text: '# of feet',
                                        bold: true
                                    }
                                ]
                            }
                        ]
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
                                ]
                            }
                        ]
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
                                ]
                            }
                        ]
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
                                        text: '# of lives',
                                        bold: true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'table-cell',
                        children: [
                            {
                                type: 'paragraph',
                                children: [
                                    {
                                        text: '1'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'table-cell',
                        children: [
                            {
                                type: 'paragraph',
                                children: [
                                    {
                                        text: '1'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'table-cell',
                        children: [
                            {
                                type: 'paragraph',
                                children: [
                                    {
                                        text: '9'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };
    for (let index = 0; index < rowCount; index++) {
        table.children.push(getRow(index));
    }
    return [table];
};

const initialValue = [
    {
        type: 'paragraph',
        key: 'skiiz',
        children: [
            {
                text: 'Since the editor is based on a recursive tree model, similar to an HTML document, you can create complex nested structures, like tables:'
            }
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
                                        text: '# of lives',
                                        bold: true
                                    }
                                ],
                                key: 'RRaJz'
                            }
                        ],
                        key: 'PHBiz'
                    },
                    {
                        type: 'table-cell',
                        children: [
                            {
                                type: 'paragraph',
                                children: [
                                    {
                                        text: '1'
                                    }
                                ],
                                key: 'RHFFX'
                            }
                        ],
                        key: 'yixrz'
                    },
                    {
                        type: 'table-cell',
                        children: [
                            {
                                type: 'paragraph',
                                children: [
                                    {
                                        text: '1'
                                    }
                                ],
                                key: 'wKKGn'
                            }
                        ],
                        key: 'mXHKP'
                    },
                    {
                        type: 'table-cell',
                        children: [
                            {
                                type: 'paragraph',
                                children: [
                                    {
                                        text: '9'
                                    }
                                ],
                                key: 'KABHC'
                            }
                        ],
                        key: 'NbWWd'
                    }
                ],
                key: 'PZrzi'
            }
        ],
        key: 'rGcGZ'
    },
    {
        type: 'paragraph',
        key: 'EbNiJ',
        children: [
            {
                text: "This table is just a basic example of rendering a table, and it doesn't have fancy functionality. But you could augment it to add support for navigating with arrow keys, displaying table headers, adding column and rows, or even formulas if you wanted to get really crazy!"
            }
        ]
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

const withTable = (editor: Editor) => {
    const { isBlockCard } = editor;
    editor.isBlockCard = (node: Node) => {
        if (Element.isElement(node) && node.type === 'table') {
            return true;
        }
        return isBlockCard(node);
    };
    return editor;
};
