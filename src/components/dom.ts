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

  public set text(value: string) {
    this._el.innerText = value;
  }

  public get html() {
    return this._el.innerHTML;
  }

  public set html(value: string) {
    this._el.innerHTML = value;
  }

  public get id() {
    return this._el.id;
  }

  public set id(value: string) {
    this._el.id = value;
  }

  public get className() {
    return this._el.className;
  }

  public set className(value: string) {
    this._el.className = value;
  }

  public focus() {
    this._el.focus();
  }

  public blur() {
    this._el.blur();
  }

  public get targetElement() {
    return this._el;
  }

  public moveCursorEnd() {
    DOMHandler.moveCursorEnd(this._el);
  }

  public moveCursorStart() {
    DOMHandler.moveCursorStart(this._el);
  }

  public destory() {
    this._el.remove();
  }

  public appendChild(d: DOM) {
    this._children.push(d);
    this._el.appendChild(d.targetElement);
  }

  public insertAfter(d: DOM) {
    DOMHandler.insertAfter(this._el, d.targetElement);
  }

  public insertBefore(d: DOM) {
    DOMHandler.insertBefore(this._el, d.targetElement);
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
    
  }

  public static moveCursorStart(el: HTMLElement) :void {
    
  }
}