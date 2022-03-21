import { fakeAsync, flush } from '@angular/core/testing';
import { createEditor, Editor, Path, Transforms, Node } from 'slate';
import { withAngular } from './with-angular';
import { EDITOR_TO_ON_CHANGE } from '../utils/weak-maps';
import { AngularEditor } from './angular-editor';
import * as Types from 'custom-types';

describe('with-angular', () => {
  let angularEditor: AngularEditor;
  function configEditor() {
    angularEditor = withAngular(createEditor());
    angularEditor.children = [
      {
        type: 'paragraph',
        children: [
          { text: 'This is editable ' },
          { text: 'rich' },
          { text: ' text, ' },
          { text: 'much' },
          { text: ' better than a ' },
          { text: '<textarea>' },
          { text: '!' },
        ],
      },
      {
        type: 'numbered-list',
        children: [
          {
            type: 'list-item',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: 'a',
                  },
                ],
              },
            ],
          },
          {
            type: 'list-item',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: '',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            text: 'text1',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            text: 'text2',
          },
        ],
      },
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
    it('custom onChange was called', fakeAsync(() => {
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
    describe('move_node', ()=>{
      it('move node to sibling when there have a common parent', fakeAsync(() => {
        Transforms.select(angularEditor, {
          anchor: {
            path: [1, 0, 0, 0],
            offset: 0,
          },
          focus: {
            path: [1, 0, 0, 0],
            offset: 1,
          },
        });
        flush();
        const oldPath = angularEditor.selection.anchor.path;
        const newPath = [...Path.next(oldPath.slice(0, 2)), 0, 0];
        let firstItem = Node.get(angularEditor, oldPath) as any;
        let lastItem = Node.get(angularEditor, newPath) as any;
        expect(firstItem.text).toBe('a');
        expect(lastItem.text).toBe('');
        Transforms.moveNodes(angularEditor, {
          at: oldPath, //  [1, 0, 0, 0]
          to: newPath, // [1, 1, 0, 0]
        });
        let matches = [];
        const commonPath = getCommonPath(oldPath, newPath);
        expect(commonPath.length).toBe(1);
        expect(commonPath[0]).toBe(1); // [1]
        matches = getOldPathMatches(angularEditor, oldPath, matches);
        expect(matches.length).toBe(4); // []、[1] 、[1, 0]、[1, 0, 0]
        matches = getNewPathMatches(angularEditor, commonPath, newPath, matches);
        expect(matches.length).toBe(6); // []、[1] 、[1, 0]、[1, 0, 0]、[1, 1]、[1, 1, 0]
        firstItem = Node.get(angularEditor, oldPath) as any;
        lastItem = Node.get(angularEditor, newPath) as any;
        expect(firstItem.text).toBe('');
        expect(lastItem.text).toBe('a');
        expect(angularEditor.children.length).toBe(4);
      }));
      it('move node to sibling when there is no common parent', fakeAsync(() => {
        Transforms.select(angularEditor, {
          anchor: {
            path: [2, 0],
            offset: 0,
          },
          focus: {
            path: [2, 0],
            offset: 5,
          },
        });
        flush();
        const oldPath = angularEditor.selection.anchor.path;
        const newPath = Path.next(oldPath.slice(0, 1));
        expect((angularEditor.children[2] as any).children[0].text).toBe('text1');
        expect((angularEditor.children[3] as any).children[0].text).toBe('text2');
        Transforms.moveNodes(angularEditor, {
          at: oldPath,  // [2, 0]
          to: [...newPath, 0], // [3, 0]
        });
        let matches = [];
        const commonPath = getCommonPath(oldPath, newPath);
        expect(commonPath.length).toBe(0);
        matches = getOldPathMatches(angularEditor, oldPath, matches);
        expect(matches.length).toBe(2); // []、[2]
        matches = getNewPathMatches(angularEditor, commonPath, newPath, matches);
        expect(matches.length).toBe(2);
        expect(angularEditor.children.length).toBe(4);
        expect((angularEditor.children[2] as any).children[0].text).toBe('');
        expect((angularEditor.children[3] as any).children[0].text).toBe(
          'text1text2'
        );
      }));
      it('move from child node to outside', fakeAsync(() => {
        Transforms.select(angularEditor, {
          anchor: {
            path: [1, 1, 0, 0],
            offset: 0,
          },
          focus: {
            path: [1, 1, 0, 0],
            offset: 0,
          },
        });
        flush();
        const listItemPath = angularEditor.selection.anchor.path;
        const newPath = Path.next(listItemPath.slice(0, 1));
        const oldPath = listItemPath.slice(0, 3);
        expect(angularEditor.children.length).toBe(4);
        Transforms.moveNodes(angularEditor, {
          at: oldPath, // [1, 1, 0]
          to: newPath, // [2]
        });
        flush();
        let matches = [];
        const commonPath = getCommonPath(oldPath, newPath);
        expect(commonPath.length).toBe(0);
        matches = getOldPathMatches(angularEditor, oldPath, matches);
        expect(matches.length).toBe(3); // []、[1] 、[1, 1]
        matches = getNewPathMatches(angularEditor, commonPath, newPath, matches);
        expect(matches.length).toBe(3);
        expect(angularEditor.children.length).toBe(5);
      }));
      it('move to child node from outside', fakeAsync(() => {
        Transforms.select(angularEditor, {
          anchor: {
            path: [2, 0],
            offset: 0,
          },
          focus: {
            path: [2, 0],
            offset: 5,
          },
        });
        flush();
        const oldPath = angularEditor.selection.anchor.path;
        const newPath = [1, 1, 0, 0];
        expect((angularEditor.children[2] as any).children[0].text).toBe('text1');
        const node = Node.get(angularEditor, newPath) as any;
        expect(node.text).toBe('');
        Transforms.moveNodes(angularEditor, {
          at: oldPath, // [2, 0]
          to: newPath, // [1, 1, 0, 0]
        });
        flush();
        let matches = [];
        const commonPath = getCommonPath(oldPath, newPath);
        expect(commonPath.length).toBe(0);
        matches = getOldPathMatches(angularEditor, oldPath, matches);
        expect(matches.length).toBe(2); // []、[2]
        matches = getNewPathMatches(angularEditor, commonPath, newPath, matches);
        expect(matches.length).toBe(5); // []、[1]、[1, 1]、[1, 1, 0]、[2]
        expect((angularEditor.children[2] as any).children[0].text).toBe('');
        expect((Node.get(angularEditor, newPath) as any).text).toBe('text1');
      }));
    })
  });
});

const getOldPathMatches = (angularEditor, oldPath, matches) => {
  for (const [node, path] of Editor.levels(angularEditor, {
    at: Path.parent(oldPath),
  })) {
    const key = AngularEditor.findKey(angularEditor, node);
    matches.push([path, key]);
  }
  return matches;
};

const getNewPathMatches = (angularEditor, commonPath, newPath, matches) => {
  for (const [node, path] of Editor.levels(angularEditor, {
    at: Path.parent(newPath),
  })) {
    if (path.length > commonPath.length) {
      const key = AngularEditor.findKey(angularEditor, node);
      matches.push([path, key]);
    }
  }
  return matches;
};

const getCommonPath = (oldPath, newPath) => {
  const commonPath = Path.common(Path.parent(oldPath), Path.parent(newPath));
  return commonPath || [];
};
