import { DOM } from "./dom";

export type BlockType =
  | 'plain'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'link'
  | 'paragraph';

export interface BlockProps {
  id?: string;
  className: string;
  type: BlockType;
}

export interface BlockContent {
  text: string;
  html: string;
  className: string;
  id: string;
  type: BlockType;
}

export abstract class Block {
  protected _blockDOM: DOM | null = null;
  protected _textareaDOM: DOM | null = null;
  protected _operatorDOM: DOM | null = null;

  protected _props: BlockProps = {
    type: 'plain',
    className: 'boed-block',
  };

  constructor(props?: BlockProps) {
    this._props = {...this._props, ...props};
    this.create();
  }

  public get json() :BlockContent {
    return {
      text: this._textareaDOM?.text || '',
      html: this._textareaDOM?.html || '',
      className: this._blockDOM?.className || '',
      id: this._blockDOM?.id || this._props.id || '',
      type: this._props.type,
    }
  }

  public set focused(value: boolean) {
    if (value) {
      // @ts-ignore
      this._blockDOM?.className = this._props.className + ' focused';
      this._textareaDOM?.focus();
    } else {
      // @ts-ignore
      this._blockDOM?.className = this._props.className;
      this._textareaDOM?.blur();
    }
  }

  public get focused() {
    if (!this._textareaDOM?.focused) {
      return false;
    } else {
      return this._textareaDOM?.focused;
    }
  }

  public get targetElement() {
    return this._blockDOM?.targetElement;
  }

  /**
   * 聚焦至该 block
   */
  public focus() {
    if (!this.focused) this._textareaDOM?.moveCursorEnd();
    this.focused = true;
  }

  public blur() {
    this.focused = false;
  }

  public onClick(cb?: any) {
    if (cb) cb();
  }

  // destory the dom
  public destory() {
    this._blockDOM?.destory();
  }

  public isEqual(el: HTMLElement) {
    if (el === this._blockDOM?.targetElement) return true;
    if (el === this._textareaDOM?.targetElement) return true;
    if (el === this._operatorDOM?.targetElement) return true;
    return false;
  }

  public insertAfter(b: Block) {
    if (b._blockDOM) this._blockDOM?.insertAfter(b._blockDOM);
  }

  public insertBefore(b: Block) {
    if (b._blockDOM) this._blockDOM?.insertBefore(b._blockDOM);
  }

  public create() {
    this._blockDOM = this.createBlock();
    this._textareaDOM = this.createTextArea();
    this._operatorDOM = this.createOperator();

    this._blockDOM.appendChild(this._operatorDOM);
    this._blockDOM.appendChild(this._textareaDOM);

    return this._blockDOM.targetElement;
  }

  protected createBlock() {
    const block = new DOM('div', {
      className: this._props.className,
      id: `boed-block-${(new Date()).valueOf()}`
    });

    return block;
  }

  protected createTextArea() {
    const d = new DOM(this.blockType, {
      className: this._props.className + '-textarea',
      id: `boed-block-textarea-${(new Date()).valueOf()}`,
    });

    d.targetElement.contentEditable = 'true';
    d.targetElement.style.outline = 'none';
    d.targetElement.style.display = 'inline-block';

    return d;
  }

  protected createOperator() {
    const o = new DOM('span', {
      className: this._props.className + '-operator'
    });
    o.targetElement.innerText = '+';
    o.targetElement.style.display = 'inline-block';
    return o;
  }

  protected get blockType() :keyof HTMLElementTagNameMap {
    switch(this._props?.type) {
      case 'plain':
        return 'div';
      case 'link':
        return 'a';
      default:
        return 'div';
    }
  }
}

export class PlainBlock extends Block {
  constructor(props?: BlockProps) {
    super(props);
  }
}