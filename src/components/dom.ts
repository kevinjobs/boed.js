export class DOM {
  private _el: HTMLElement;
  private _children: DOM[];
  private _options: any;

  constructor(private tag: keyof HTMLElementTagNameMap, options?: any) {
    this._el = DOMHandler.createElement(this.tag);
    this._children = [];
    this._options = { ...options };

    this._el.className = this._options.className;
    this._el.id = this._options.id;
  }

  public get focused() :boolean {
    if (!document.activeElement) return false;
    if (!this._el) return false;
    
    if (this._el.id === document.activeElement.id) {
      return true;
    } else {
      return false;
    }
  }

  public get text() {
    return this._el.innerText;
  }

  public get html() {
    return this._el.innerHTML;
  }

  public get id() {
    return this._el.id;
  }

  public get className() {
    return this._el.className;
  }

  public set className(value: string) {
    this._el.className = value;
  }

  public get createAt() {
    return this._el.dataset?.create;
  }

  public focus() {
    this._el.focus();
  }

  public blur() {
    this._el.blur();
  }

  public get target() {
    return this._el;
  }

  public moveCursorEnd() {
    DOMHandler.moveCursorEnd(this._el);
  }

  public destory() {
    this._el.remove();
  }

  public appendChild(d: DOM) {
    this._children.push(d);
    this._el.appendChild(d.target);
  }

  public listen(evtName: keyof HTMLElementEventMap, handler: (evt: any) => void) {
    DOMHandler.listen(this._el, evtName, handler);
  }
}

export default class DOMHandler {
  constructor() {}

  public static insertAfter(target: HTMLElement, n: HTMLElement) {
    let parent = target.parentElement;
    if (parent?.lastChild == target) {
      parent.appendChild(n);
    } else {
      parent?.insertBefore(n, target.nextSibling);
    }
  }

  public static insertBefore(target: HTMLElement, n: HTMLElement) {
    
  }

  public static createElement(tagName: keyof HTMLElementTagNameMap, options?: ElementCreationOptions | undefined) {
    return document.createElement<typeof tagName>(tagName, options);
  }

  public static listen(el: HTMLElement, evtName: keyof HTMLElementEventMap, handler: (evt: any) => void) {
    el.addEventListener(evtName, (evt) => {
      handler(evt);
    });
  }

  /**
   * move cursor to the end for HTMLElement can be edited.
   * @param el HTMLElement
   * @returns void
   */
  public static moveCursorEnd(el: HTMLElement) :void {
    if (!el.contentEditable) return;
    // 重新聚焦后，光标可能在最前面，这段代码可以将光标移至最后
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
}