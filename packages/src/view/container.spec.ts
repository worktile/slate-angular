import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed
} from "@angular/core/testing";
import { createMutipleParagraph } from "../testing/create-document";
import {
  AdvancedEditableComponent,
  TestingLeafComponent,
  configureBasicEditableTestingModule
} from "../testing";
import { Editor, Transforms, Node } from "slate";
import { AngularEditor } from "slate-angular";

describe("ViewContainer Class", () => {
  let component: AdvancedEditableComponent;
  let fixture: ComponentFixture<AdvancedEditableComponent>;
  let editor: Editor;

  beforeEach(fakeAsync(() => {
    configureBasicEditableTestingModule(
      [AdvancedEditableComponent, TestingLeafComponent],
      [TestingLeafComponent]
    );
    fixture = TestBed.createComponent(AdvancedEditableComponent);
    component = fixture.componentInstance;
    component.value = createMutipleParagraph();
    editor = component.editor;
  }));

  describe("move nodes", () => {
    it("move node from [0] to [1]", fakeAsync(() => {
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      const parent = AngularEditor.toDOMNode(editor, editor);
      Transforms.moveNodes(editor, { at: [0], to: [1] });
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(Node.string(editor.children[0])).toEqual("1");
      const newP0 = parent.children.item(0) as HTMLElement;
      const newP1 = parent.children.item(1) as HTMLElement;
      expect(newP0.textContent).toEqual("1");
      expect(newP1.textContent).toEqual("0");
    }));
    it("move node from [2] to [5]", fakeAsync(() => {
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      const parent = AngularEditor.toDOMNode(editor, editor);
      Transforms.moveNodes(editor, { at: [2], to: [5] });
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      const newP5 = parent.children.item(5) as HTMLElement;
      const newP3 = parent.children.item(3) as HTMLElement;
      expect(newP5.textContent).toEqual("2");
      expect(newP3.textContent).toEqual("4");
    }));
    it("move node from [5] to [2]", fakeAsync(() => {
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      const parent = AngularEditor.toDOMNode(editor, editor);
      Transforms.moveNodes(editor, { at: [5], to: [2] });
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      const newP2 = parent.children.item(2) as HTMLElement;
      const newP5 = parent.children.item(5) as HTMLElement;
      expect(newP2.textContent).toEqual("5");
      expect(newP5.textContent).toEqual("4");
    }));
  });
});
