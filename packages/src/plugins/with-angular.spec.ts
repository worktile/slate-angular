import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { createEditor, Editor, Path, Transforms, Node } from "slate";
import { withAngular } from "./with-angular";
import { EDITOR_TO_ON_CHANGE, NODE_TO_KEY } from "../utils/weak-maps";
import { AngularEditor } from "./angular-editor";
import { BasicEditableComponent } from '../testing/basic-editable.component'
import * as Types from "custom-types";
import { configureBasicEditableTestingModule } from "../testing/module";

describe("with-angular", () => {
  let angularEditor: AngularEditor;
  let moveNodeEditor: AngularEditor;
  function configEditor() {
    angularEditor = withAngular(createEditor());
    moveNodeEditor = withAngular(createEditor());
    angularEditor.children = [
      {
        type: "paragraph",
        children: [
          { text: "This is editable " },
          { text: "rich" },
          { text: " text, " },
          { text: "much" },
          { text: " better than a " },
          { text: "<textarea>" },
          { text: "!" },
        ],
      },
    ];
    moveNodeEditor.children = [
      {
        type: "table",
        children: [
          {
            type: "table-row",
            children: [
            ],
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            text: "text1",
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            text: "text2",
          },
        ],
      },
    ];
  }
  beforeEach(() => {
    configEditor();
  });
  describe("onChange", () => {
    it("default onChange was called", fakeAsync(() => {
      spyOn(angularEditor, "onChange").and.callThrough();
      Transforms.select(angularEditor, {
        anchor: {
          path: [0, 0],
          offset: 0,
        },
        focus: {
          path: [0, 0],
          offset: 3,
        },
      });
      flush();
      expect(angularEditor.onChange).toHaveBeenCalled();
    }));
    it("custom onChange was called", fakeAsync(() => {
      let isOnChanged = false;
      EDITOR_TO_ON_CHANGE.set(angularEditor, () => {
        isOnChanged = true;
      });
      Transforms.select(angularEditor, {
        anchor: {
          path: [0, 0],
          offset: 0,
        },
        focus: {
          path: [0, 0],
          offset: 3,
        },
      });
      flush();
      expect(isOnChanged).toBeTruthy();
    }));
  });

  describe('apply', () => {
    let component: BasicEditableComponent;
    let fixture: ComponentFixture<BasicEditableComponent>;

    beforeEach(fakeAsync(() => {
      configureBasicEditableTestingModule([BasicEditableComponent]);
      fixture = TestBed.createComponent(BasicEditableComponent);
      component = fixture.componentInstance;
      component.value = [
        { type: 'paragraph', children: [{ text: 'first text!' }] },
        {
          type: "table",
          children: [
            {
              type: "table-row",
              children: [
                {
                  type: "table-cell",
                  children: [
                    {
                      type: 'paragraph',
                      children: [{ text: '1!' }]
                    },
                    {
                      type: 'paragraph',
                      children: [{ text: '2!' }]
                    }
                  ]
                },
                {
                  type: "table-cell",
                  children: [
                    {
                      type: 'paragraph',
                      children: [{ text: '3!' }]
                    },
                    {
                      type: 'paragraph',
                      children: [{ text: '4!' }]
                    }
                  ]
                },
              ],
            },
            {
              type: "table-row",
              children: [
                {
                  type: "table-cell",
                  children: [
                    {
                      type: 'paragraph',
                      children: [{ text: '5!' }]
                    },
                    {
                      type: 'paragraph',
                      children: [{ text: '6!' }]
                    }
                  ]
                },
                {
                  type: "table-cell",
                  children: [
                    {
                      type: 'paragraph',
                      children: [{ text: '7!' }]
                    },
                    {
                      type: 'paragraph',
                      children: [{ text: '8!' }]
                    }
                  ]
                },
              ],
            },
          ],
        },
        {
          type: "table",
          children: [
            {
              type: "table-row",
              children: [
                {
                  type: "table-cell",
                  children: [
                    {
                      type: 'paragraph',
                      children: [{ text: '1!' }]
                    },
                    {
                      type: 'paragraph',
                      children: [{ text: '2!' }]
                    }
                  ]
                },
                {
                  type: "table-cell",
                  children: [
                    {
                      type: 'paragraph',
                      children: [{ text: '3!' }]
                    },
                    {
                      type: 'paragraph',
                      children: [{ text: '4!' }]
                    }
                  ]
                },
              ],
            },
            {
              type: "table-row",
              children: [
                {
                  type: "table-cell",
                  children: [
                    {
                      type: 'paragraph',
                      children: [{ text: '5!' }]
                    },
                    {
                      type: 'paragraph',
                      children: [{ text: '6!' }]
                    }
                  ]
                },
                {
                  type: "table-cell",
                  children: [
                    {
                      type: 'paragraph',
                      children: [{ text: '7!' }]
                    },
                    {
                      type: 'paragraph',
                      children: [{ text: '8!' }]
                    }
                  ]
                },
              ],
            },
          ],
        },
        { type: 'paragraph', children: [{ text: 'last text!' }] }
      ];
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
    }));

    afterEach(() => {
      fixture.destroy();
    });

    it('move node to sibling when there have a common parent', fakeAsync(() => {
      const oldPath = [1,0,0,0];
      const newPath = [1,0,0,1];
      const tablePath = [1];
      const tableRowPath = [1, 0];
      const tableCellPath = [1, 0, 0];
      const tableNode = Node.get(component.editor, tablePath);
      const tableRowNode = Node.get(component.editor, tableRowPath);
      const tableCellNode = Node.get(component.editor, tableCellPath);
      Transforms.moveNodes(component.editor, {
        at: oldPath,
        to: newPath,
      });
      tick(100);
      const newTableNode = Node.get(component.editor, tablePath);
      const newTableRowNode = Node.get(component.editor, tableRowPath);
      const newTableCellNode = Node.get(component.editor, tableCellPath);
      expect(tableNode).not.toEqual(newTableNode);
      validKey(tableNode, newTableNode);
      expect(tableRowNode).not.toEqual(newTableRowNode);
      validKey(tableRowNode, newTableRowNode);
      expect(tableCellNode).not.toEqual(newTableCellNode);
      validKey(tableCellNode, newTableCellNode);
    }));

    it('move node to sibling when there is no common parent', fakeAsync(() => {
      const oldPath = [1,0,0,0];
      const newPath = [2,0,0,1];

      const tablePath = [1];
      const tableRowPath = [1, 0];
      const tableCellPath = [1, 0, 0];
      const tableNode = Node.get(component.editor, tablePath);
      const tableRowNode = Node.get(component.editor, tableRowPath);
      const tableCellNode = Node.get(component.editor, tableCellPath);

      const tablePath2 = [2];
      const tableRowPath2 = [2, 0];
      const tableCellPath2 = [2, 0, 0];
      const tableNode2 = Node.get(component.editor, tablePath2);
      const tableRowNode2 = Node.get(component.editor, tableRowPath2);
      const tableCellNode2 = Node.get(component.editor, tableCellPath2);

      Transforms.moveNodes(component.editor, {
        at: oldPath,
        to: newPath,
      });
      tick(100);

      // valid move origin
      const newTableNode = Node.get(component.editor, tablePath);
      const newTableRowNode = Node.get(component.editor, tableRowPath);
      const newTableCellNode = Node.get(component.editor, tableCellPath);
      expect(tableNode).not.toEqual(newTableNode);
      validKey(tableNode, newTableNode);
      expect(tableRowNode).not.toEqual(newTableRowNode);
      validKey(tableRowNode, newTableRowNode);
      expect(tableCellNode).not.toEqual(newTableCellNode);
      validKey(tableCellNode, newTableCellNode);

      // valid move targit
      const newTableNode2 = Node.get(component.editor, tablePath2);
      const newTableRowNode2 = Node.get(component.editor, tableRowPath2);
      const newTableCellNode2 = Node.get(component.editor, tableCellPath2);
      expect(tableNode2).not.toEqual(newTableNode2);
      validKey(tableNode2, newTableNode2);
      expect(tableRowNode2).not.toEqual(newTableRowNode2);
      validKey(tableRowNode2, newTableRowNode2);
      expect(tableCellNode2).not.toEqual(newTableCellNode2);
      validKey(tableCellNode2, newTableCellNode2);
    }));
  });
});

const validKey = (oldNode, newNode) => {
  expect(NODE_TO_KEY.get(oldNode)).toEqual(NODE_TO_KEY.get(newNode));
};
