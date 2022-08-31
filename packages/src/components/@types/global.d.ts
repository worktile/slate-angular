export {};

declare global {
  interface ShadowRoot {
    getSelection: Document["getSelection"];
  }
}
