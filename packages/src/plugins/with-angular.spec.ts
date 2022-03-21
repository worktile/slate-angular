import { fakeAsync, flush } from "@angular/core/testing";
import { createEditor, Editor, Path, Transforms, Node } from "slate";
import { withAngular } from "./with-angular";
import { EDITOR_TO_ON_CHANGE, NODE_TO_KEY } from "../utils/weak-maps";
import { AngularEditor } from "./angular-editor";
import * as Types from "custom-types";

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
              {
                type: "table-cell",
                children: [
                  {
                    type: "numbered-list",
                    children: [
                      {
                        type: "list-item",
                        children: [
                          {
                            type: "paragraph",
                            children: [
                              {
                                text: "a",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: "list-item",
                        children: [
                          {
                            type: "paragraph",
                            children: [
                              {
                                text: "b",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: "list-item",
                        children: [
                          {
                            type: "paragraph",
                            children: [
                              {
                                text: "",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
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

  describe("apply", () => {
    describe("move_node", () => {
      it("move node to sibling when there have a common parent", () => {
        Transforms.select(moveNodeEditor, {
          anchor: {
            path: [0, 0, 0, 0, 0],
            offset: 0,
          },
          focus: {
            path: [0, 0, 0, 0, 0],
            offset: 0,
          },
        });
        const oldPath = moveNodeEditor.selection.anchor.path;
        const newPath = [0, 0, 0, 0, 1];
        let matches = [];
        const commonPath = getCommonPath(oldPath, newPath);
        expect(commonPath.length).toBe(4);
        matches = getOldPathMatches(moveNodeEditor, oldPath, matches);
        expect(matches.length).toBe(5); // []、[0] 、[0, 0]、[0, 0, 0], [0, 0, 0, 0]
        matches = getNewPathMatches(
          moveNodeEditor,
          commonPath,
          newPath,
          matches
        );
        expect(matches.length).toBe(5);
        Transforms.moveNodes(moveNodeEditor, {
          at: oldPath,
          to: newPath,
        });
        console.log(moveNodeEditor.children)
        validKey(moveNodeEditor, matches);
      });

      it("move node to sibling when there is no common parent", () => {
        Transforms.select(moveNodeEditor, {
          anchor: {
            path: [1],
            offset: 0,
          },
          focus: {
            path: [1],
            offset: 0,
          },
        });
        const oldPath = moveNodeEditor.selection.anchor.path;
        const newPath = [2];
        let matches = [];
        const commonPath = getCommonPath(oldPath, newPath);
        expect(commonPath.length).toBe(0);
        matches = getOldPathMatches(moveNodeEditor, oldPath, matches);
        expect(matches.length).toBe(1); // []
        matches = getNewPathMatches(
          moveNodeEditor,
          commonPath,
          newPath,
          matches
        );
        expect(matches.length).toBe(1);
        Transforms.moveNodes(moveNodeEditor, {
          at: oldPath,
          to: newPath
        });
        validKey(moveNodeEditor, matches);
      });

      it("move from child node to outside", () => {
        Transforms.select(moveNodeEditor, {
          anchor: {
            path: [0, 0, 0, 0, 2],
            offset: 0,
          },
          focus: {
            path: [0, 0, 0, 0, 2],
            offset: 0,
          },
        });
        const oldPath = moveNodeEditor.selection.anchor.path;
        const newPath = [0, 0, 0, 1];
        let matches = [];
        const commonPath = getCommonPath(oldPath, newPath);
        expect(commonPath.length).toBe(3);
        matches = getOldPathMatches(moveNodeEditor, oldPath, matches);
        expect(matches.length).toBe(5); //[]、[0] 、[0, 0]、[0, 0, 0], [0, 0, 0, 0]
        matches = getNewPathMatches(
          moveNodeEditor,
          commonPath,
          newPath,
          matches
        );
        expect(matches.length).toBe(5);
        Transforms.moveNodes(moveNodeEditor, {
          at: oldPath,
          to: newPath,
        });
        validKey(moveNodeEditor, matches);
      });

      it("move to child node from outside", () => {
        Transforms.select(moveNodeEditor, {
          anchor: {
            path: [1],
            offset: 0,
          },
          focus: {
            path: [1],
            offset: 0,
          },
        });
        const oldPath = moveNodeEditor.selection.anchor.path;
        const newPath = [0, 0, 0, 0, 2, 0];
        let matches = [];
        const commonPath = getCommonPath(oldPath, newPath);
        expect(commonPath.length).toBe(0);
        matches = getOldPathMatches(moveNodeEditor, oldPath, matches);
        expect(matches.length).toBe(1); // []
        matches = getNewPathMatches(
          moveNodeEditor,
          commonPath,
          newPath,
          matches
        );
        expect(matches.length).toBe(6); // []、[0]、[0, 0]、[0, 0, 0], [0, 0, 0, 0]、 [0, 0, 0, 2]
        Transforms.moveNodes(moveNodeEditor, {
          at: oldPath,
          to: newPath,
        });
        validKey(moveNodeEditor, matches);
      });
    });
  });
});

const getOldPathMatches = (moveNodeEditor, oldPath, matches) => {
  for (const [node, path] of Editor.levels(moveNodeEditor, {
    at: Path.parent(oldPath),
  })) {
    const key = AngularEditor.findKey(moveNodeEditor, node);
    matches.push([path, key]);
  }
  return matches;
};

const getNewPathMatches = (moveNodeEditor, commonPath, newPath, matches) => {
  for (const [node, path] of Editor.levels(moveNodeEditor, {
    at: Path.parent(newPath),
  })) {
    if (path.length > commonPath.length) {
      const key = AngularEditor.findKey(moveNodeEditor, node);
      matches.push([path, key]);
    }
  }
  return matches;
};

const getCommonPath = (oldPath, newPath) => {
  const commonPath = Path.common(Path.parent(oldPath), Path.parent(newPath));
  return commonPath || [];
};

const validKey = (moveNodeEditor, matches) => {
  for (const [path, key] of matches) {
    const [node] = Editor.node(moveNodeEditor, path);
    expect(NODE_TO_KEY.get(node)).toEqual(key);
  }
};
