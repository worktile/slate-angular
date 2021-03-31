import { Injectable, TemplateRef } from '@angular/core';
import { Editor, Element as SlateElement, Text as SlateText, Range, Path, Node, NodeEntry } from 'slate';
import { AngularEditor } from '../plugins/angular-editor';
import { ViewElement, ViewText, ViewNode } from '../interfaces/view-node';
import { NODE_TO_PARENT, NODE_TO_INDEX, NODE_TO_VIEWNODE } from '../utils/weak-maps';
import { Key } from '../utils/key';
import { ComponentAttributes } from '../core/component.base';
import { SlaTemplateComponent } from '../components/template/template.component';
import { ViewRefType } from '../interfaces/view-node';

@Injectable()
export class ViewNodeService {
    private editor: AngularEditor;

    private renderElement: ((element: SlateElement) => ViewRefType) | null;

    private renderLeaf: ((text: SlateText) => TemplateRef<any>) | null;

    private slaTemplate: SlaTemplateComponent;

    private decorate: (nodeEntry: NodeEntry) => Range[] = () => [];

    private readonly: boolean;

    initialize(
        editor: AngularEditor,
        renderElement: ((element: SlateElement) => ViewRefType) | null,
        renderLeaf: ((text: SlateText) => TemplateRef<any>) | null,
        slaTemplate: SlaTemplateComponent,
        decorate: (nodeEntry: NodeEntry) => Range[],
        readonly: boolean
    ) {
        this.editor = editor;
        this.renderElement = renderElement;
        this.renderLeaf = renderLeaf;
        this.decorate = decorate;
        this.slaTemplate = slaTemplate;
        this.readonly = readonly;
    }

    public pack(viewNodes: ViewElement[], decorations?: Range[]): ViewElement[] {
        return this.packChildren(this.editor, this.editor.selection, [...viewNodes], decorations) as ViewElement[];
    }

    private packChildren(parent: SlateElement, pSelection: Range | null, viewNodes: ViewNode[], decorations?: Range[]) {
        const path = AngularEditor.findPath(this.editor, parent);
        const parentIsVoid = this.editor.isVoid(parent);
        parent.children.forEach((node, i) => {
            NODE_TO_PARENT.set(node, parent);
            NODE_TO_INDEX.set(node, i);
            const memoViewNode = NODE_TO_VIEWNODE.get(node);
            const viewNode = viewNodes[i];
            if (memoViewNode) {
                if (memoViewNode !== viewNode) {
                    viewNodes[i] = memoViewNode;
                }
                const memoDecorations = this.memoDecorations(memoViewNode, decorations, node, i, path);
                if (ViewElement.isViewElement(memoViewNode)) {
                    const selection = this.memoSelection(memoViewNode, path, pSelection, i);
                    if (selection !== memoViewNode.context.selection || memoViewNode.context.decorations !== memoDecorations) {
                        const children = this.packChildren(
                            node as SlateElement,
                            selection,
                            [...memoViewNode.context.children],
                            memoDecorations
                        );
                        memoViewNode.context = { ...memoViewNode.context, decorations: memoDecorations, selection, children };
                    }
                } else {
                    if (memoViewNode.context.decorations !== memoDecorations) {
                        memoViewNode.context.decorations = memoDecorations;
                    }
                    if (memoViewNode.context.parent !== parent) {
                        memoViewNode.context.parent = parent;
                    }
                    memoViewNode.viewRef = parentIsVoid ? this.slaTemplate.voidTextTemplate : this.slaTemplate.textTemplate;
                }
                return;
            }
            const newDecorations = this.memoDecorations(viewNode, decorations, node, i, path);
            if (SlateText.isText(node)) {
                const { key } = this.memoViewText(viewNode, node, i);
                viewNodes[i] = {
                    viewRef: parentIsVoid ? this.slaTemplate.voidTextTemplate : this.slaTemplate.textTemplate,
                    context: {
                        text: node,
                        parent: parent,
                        index: i,
                        editor: this.editor,
                        decorations: newDecorations,
                        renderLeaf: this.renderLeaf
                    },
                    key
                };
                NODE_TO_VIEWNODE.set(node, viewNodes[i]);
            } else {
                const viewRef = this.memoElementViewRef(viewNode, node);
                const selection = this.memoSelection(viewNode, path, pSelection, i);
                const attributes = this.memoAttributes(viewNode, node);
                const { children, key } = this.memoViewElement(viewNode, node, i);
                viewNodes[i] = {
                    viewRef,
                    context: {
                        element: node,
                        selection,
                        children: this.packChildren(node, selection, [...children], newDecorations),
                        attributes,
                        editor: this.editor,
                        decorations: newDecorations,
                        isInline: this.editor.isInline(node),
                        isBlockCard: this.editor.isBlockCard(node),
                        readonly: this.readonly
                    },
                    key
                };
                NODE_TO_VIEWNODE.set(node, viewNodes[i]);
            }
        });
        if (parent.children.length < viewNodes.length) {
            viewNodes.splice(parent.children.length);
        }
        if (parent.children.length !== viewNodes.length) {
            throw new Error(`Cannot resolve elements context from elements: ${JSON.stringify(parent)}`);
        }
        return viewNodes;
    }

    private memoDecorations(viewNode: ViewNode, pDecorations: Range[] = [], node: SlateElement | Node, index: number, path: Path) {
        const p = path.concat(index);
        const range = Editor.range(this.editor, p);
        const ds = this.decorate([node, p]);
        for (const dec of pDecorations) {
            const d = Range.intersection(dec, range);
            if (d) {
                ds.push(d);
            }
        }
        if (viewNode && ds.length === viewNode.context.decorations.length) {
            if (
                ds.length === 0 ||
                ds.every((decoration, i) => viewNode.context.decorations[i] && Range.equals(decoration, viewNode.context.decorations[i]))
            ) {
                return viewNode.context.decorations;
            }
        }
        return ds;
    }

    private memoViewElement(viewNode: ViewNode, node: SlateElement, index: number): { key: Key; children: ViewNode[] } {
        if (ViewElement.isViewElement(viewNode) && this.isEqualsNode(viewNode.context.element, node)) {
            return { key: viewNode.key, children: viewNode.context.children };
        } else {
            return { key: new Key(), children: [] };
        }
    }

    private memoViewText(viewNode: ViewNode, node: SlateText, index: number): { key: Key } {
        if (ViewText.isViewText(viewNode) && this.isEqualNodeNumber()) {
            return { key: viewNode.key };
        } else {
            return { key: new Key() };
        }
    }

    private memoElementViewRef(viewNode: ViewNode, element: SlateElement) {
        if (ViewElement.isViewElement(viewNode) && viewNode.context.element.type === element.type) {
            return viewNode.viewRef;
        }
        let viewRef;
        if (this.renderElement) {
            viewRef = this.renderElement(element);
        }
        return viewRef ? viewRef : this.slaTemplate.paragraphTemplate;
    }

    private memoSelection(viewNode: ViewNode, path: Path, selection: Range | null, index: number) {
        let oldSelection = null;
        if (ViewElement.isViewElement(viewNode)) {
            oldSelection = viewNode.context.selection;
        }
        const p = path.concat(index);
        try {
            const range = Editor.range(this.editor, p);
            const sel = selection && Range.intersection(range, selection);
            if (sel === oldSelection || (!!sel && !!oldSelection && Range.equals(sel, oldSelection))) {
                return oldSelection;
            } else {
                return sel;
            }
        } catch (error) {}
    }

    private memoAttributes(viewNode: ViewNode, element: SlateElement) {
        const isInline = this.editor.isInline(element);
        const isVoid = this.editor.isVoid(element);
        const attributes: ComponentAttributes = {
            'data-slate-node': 'element',
            'data-slate-key': element.key as string
        };
        if (isInline) {
            attributes['data-slate-inline'] = true;
        }
        if (isVoid) {
            attributes['data-slate-void'] = true;
            if (isInline) {
                attributes.contenteditable = false;
            }
        }
        return attributes;
    }

    private isEqualsNode(node: Node, another: Node) {
        return (this.editor.equalsNodeKey(node, another) || this.isEqualNodeNumber()) && node.type === another.type;
    }

    private isEqualNodeNumber() {
        const originalOperationTypes = ['insert_text', 'remove_text', 'set_node', 'set_selection'];
        const operations = this.editor.operations.filter(op => {
            return !originalOperationTypes.includes(op.type);
        });
        return operations.length === 0;
    }
}
