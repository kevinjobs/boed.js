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
  createAt: number | string;
  type: BlockType;
}

export abstract class Block {
  protected _block: DOM | null = null;
  protected _textarea: DOM | null = null;
  protected _operator: DOM | null = null;

  protected _props: BlockProps = {
    type: 'plain',
    className: 'boed-block',
  };

  constructor(props?: BlockProps) {
    this._props = {...this._props, ...props};
  }

  public get json() :BlockContent {
    return {
      text: this._textarea?.text || '',
      html: this._textarea?.html || '',
      className: this._block?.className || '',
      id: this._props.id || this._block?.id || '',
      createAt: this._block?.createAt || '',
      type: this._props.type,
    }
  }

  public set focused(value: boolean) {
    if (value) {
      // @ts-ignore
      this._block?.className = this._props.className + ' focused';
      this._textarea?.focus();
    } else {
      // @ts-ignore
      this._block?.className = this._props.className;
      this._textarea?.blur();
    }
  }

  public get focused() {
    if (!this._textarea?.focused) {
      return false;
    } else {
      return this._textarea?.focused;
    }
  }

  public get target() {
    return this._block?.target;
  }

  /**
   * 聚焦至该 block
   */
  public focus() {
    // 重新聚焦后，光标可能在最前面，这段代码可以将光标移至最后
    if (!this.focused) {
      this._textarea?.moveCursorEnd();
      this.focused = true;
    }
  }

  public blur() {
    // this property can be set.
    // @ts-ignore
    if (this.focused) this._block?.className = this._props.className;
    this.focused = false;
  }

  public click() {
    this.focus();
  }

  // destory the dom
  public destory() {
    this._block?.destory();
  }

  public create() {
    this._block = this.createBlock();
    this._textarea = this.createTextArea();
    this._operator = this.createOperator();

    this._block.appendChild(this._operator);
    this._block.appendChild(this._textarea);

    return this._block.target;
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

    d.target.contentEditable = 'true';
    d.target.style.outline = 'none';
    d.target.style.display = 'inline-block';

    return d;
  }

  protected createOperator() {
    const o = new DOM('span', {
      className: this._props.className + '-operator'
    });
    o.target.innerText = '+';
    o.target.style.display = 'inline-block';
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