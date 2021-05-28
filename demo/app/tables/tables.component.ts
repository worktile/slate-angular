import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { createEditor, Text } from 'slate';
import { withAngular } from 'slate-angular';
import { MarkTypes, DemoMarkTextComponent } from '../components/text/text.component';

@Component({
  selector: 'demo-tables',
  templateUrl: 'tables.component.html'
})
export class DemoTablesComponent implements OnInit {
  value = initialValue;

  editor = withAngular(createEditor());

  @ViewChild('tableTemplate', { read: TemplateRef, static: true })
  tableTemplate: TemplateRef<any>;

  @ViewChild('trTemplate', { read: TemplateRef, static: true })
  trTemplate: TemplateRef<any>;

  @ViewChild('tdTemplate', { read: TemplateRef, static: true })
  tdTemplate: TemplateRef<any>;

  ngOnInit() { }

  renderElement() {
    return (element: any) => {
      if (element.type === 'table') {
        return this.tableTemplate
      }
      if (element.type === 'table-row') {
        return this.trTemplate
      }
      if (element.type === 'table-cell') {
        return this.tdTemplate
      }
      return null;
    };
  }

  renderText = (text: Text) => {
    if (text[MarkTypes.bold] || text[MarkTypes.italic] || text[MarkTypes.code] || text[MarkTypes.underline]) {
      return DemoMarkTextComponent;
    }
  }

  valueChange(event) { }
}

const initialValue = [
  {
    "type": "paragraph",
    "key": "skiiz",
    "children": [
      {
        "text": "Since the editor is based on a recursive tree model, similar to an HTML document, you can create complex nested structures, like tables:"
      }
    ]
  },
  {
    "type": "table",
    "children": [
      {
        "type": "table-row",
        "children": [
          {
            "type": "table-cell",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "text": ""
                  }
                ],
                "key": "cByET"
              }
            ],
            "key": "MZHwE"
          },
          {
            "type": "table-cell",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "text": "Human",
                    "bold": true
                  }
                ],
                "key": "cptsk"
              }
            ],
            "key": "bsEhc"
          },
          {
            "type": "table-cell",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "text": "Dog",
                    "bold": true
                  }
                ],
                "key": "TFGzW"
              }
            ],
            "key": "mbAht"
          },
          {
            "type": "table-cell",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "text": "Cat",
                    "bold": true
                  }
                ],
                "key": "FdjGn"
              }
            ],
            "key": "RcRRZ"
          }
        ],
        "header": true,
        "key": "hGprR"
      },
      {
        "type": "table-row",
        "children": [
          {
            "type": "table-cell",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "text": "# of feet",
                    "bold": true
                  }
                ],
                "key": "SiTjf"
              }
            ],
            "key": "AtwAH"
          },
          {
            "type": "table-cell",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "text": "2"
                  }
                ],
                "key": "EHypc"
              }
            ],
            "key": "XrTFZ"
          },
          {
            "type": "table-cell",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "text": "4"
                  }
                ],
                "key": "fjdSs"
              }
            ],
            "key": "XYRfj"
          },
          {
            "type": "table-cell",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "text": "4"
                  }
                ],
                "key": "yRrtk"
              }
            ],
            "key": "aYejG"
          }
        ],
        "key": "JzTGH"
      },
      {
        "type": "table-row",
        "children": [
          {
            "type": "table-cell",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "text": "# of lives",
                    "bold": true
                  }
                ],
                "key": "RRaJz"
              }
            ],
            "key": "PHBiz"
          },
          {
            "type": "table-cell",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "text": "1"
                  }
                ],
                "key": "RHFFX"
              }
            ],
            "key": "yixrz"
          },
          {
            "type": "table-cell",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "text": "1"
                  }
                ],
                "key": "wKKGn"
              }
            ],
            "key": "mXHKP"
          },
          {
            "type": "table-cell",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "text": "9"
                  }
                ],
                "key": "KABHC"
              }
            ],
            "key": "NbWWd"
          }
        ],
        "key": "PZrzi"
      }
    ],
    "key": "rGcGZ"
  },
  {
    "type": "paragraph",
    "key": "EbNiJ",
    "children": [
      {
        "text": "This table is just a basic example of rendering a table, and it doesn't have fancy functionality. But you could augment it to add support for navigating with arrow keys, displaying table headers, adding column and rows, or even formulas if you wanted to get really crazy!"
      }
    ]
  },
  {
    "type": "paragraph",
    "key": "dFwyN",
    "children": [
      {
        "text": ""
      }
    ]
  }
];


