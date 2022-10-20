import { AfterViewChecked, Directive, ElementRef, Input, OnDestroy } from "@angular/core";
import { IS_ANDROID, UseRef } from "../../utils";
import { AngularEditor } from "../../plugins/angular-editor";
import { SlateChildrenContext, SlateViewContext } from "../../view/context";
import {
  createRestoreDomManager,
  RestoreDOMManager
} from "./restore-dom-manager";

const MUTATION_OBSERVER_CONFIG: MutationObserverInit = {
  subtree: true,
  childList: true,
  characterData: true,
  characterDataOldValue: true
};

@Directive({
  selector: "[slateRestoreDom]"
})
export class SlateRestoreDomDirective implements OnDestroy, AfterViewChecked {
  @Input()
  public editor: AngularEditor;

  protected _receivedUserInput: UseRef<boolean>;

  @Input()
  public set receivedUserInput(receivedUserInput: UseRef<boolean>) {
    if (receivedUserInput) {
      this._receivedUserInput = receivedUserInput;
      this.init();
    }
  }

  public get receivedUserInput(): UseRef<boolean> {
    return this._receivedUserInput;
  }

  @Input()
  public viewContext: SlateViewContext;

  protected _context: SlateChildrenContext;

  @Input()
  public set context(context: SlateChildrenContext) {
    this._context = context;
    this.restoreDOM();
  }

  public get context(): SlateChildrenContext {
    return this._context
  }

  protected manager: RestoreDOMManager | null = null;
  protected mutationObserver: MutationObserver | null = null;

  protected _init = false;
  private _observing = false;

  constructor(public readonly elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewChecked(): void {
    this.observe();
  }

  public init(): void {
    if (this._init === false) {
      this._init = true;

      if (!IS_ANDROID) {
        return;
      }

      const editor = this.editor;

      this.manager = createRestoreDomManager(editor, this.receivedUserInput);
      this.mutationObserver = new MutationObserver(
        this.manager.registerMutations
      );

      this.observe();
    }
  }

  restoreDOM(): void {
    const pendingMutations = this.mutationObserver?.takeRecords()
    if (pendingMutations?.length) {
      this.manager?.registerMutations(pendingMutations)
    }

    this._observing = false;
    this.mutationObserver?.disconnect()
    this.manager?.restoreDOM()
  }

  ngOnDestroy(): void {
    this._observing = false;
    this.mutationObserver?.disconnect();
  }

  observe() {
    if (!this.elementRef.nativeElement) {
      throw new Error("Failed to attach MutationObserver, `node` is undefined");
    }

    if (this.mutationObserver && this._init && !this._observing) {
      this.mutationObserver?.observe(
        this.elementRef.nativeElement,
        MUTATION_OBSERVER_CONFIG
      );
    }

  }
}
