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

export default class Block {
  private _blockElement: HTMLElement | null = null;
  private _textareaElement: HTMLElement | null = null;
  private _props: BlockProps = {
    type: 'plain',
    className: 'boed-block',
  };

  constructor(props?: BlockProps) {
    this._props = {...this._props, ...props};
  }

  get json() :BlockContent {
    return {
      text: this._textareaElement?.innerText || '',
      html: this._textareaElement?.innerHTML || '',
      className: this._blockElement?.className || '',
      id: this._blockElement?.id || '',
      createAt: this._blockElement?.dataset?.create || '',
      type: this._props.type,
    }
  }

  get id() :string {
    return this._props.id || this._blockElement?.id || '';
  }

  // destory the dom
  public destory() {
    this._blockElement?.remove();
  }

  public create() {
    const outerEl = this.createOuter();
    const containerEl = this.createTextArea();
    const operatorEl = this.createOperator();
    outerEl.appendChild(operatorEl);
    outerEl.appendChild(containerEl);

    this._blockElement = outerEl;
    this._textareaElement = containerEl;

    return outerEl;
  }

  private createOuter() {
    const el = document.createElement('div');
    el.className = this._props.className;
    el.id = `boed-block-${(new Date()).valueOf()}`;
    // problem at ie9
    // el.dataset['create'] = String((new Date()).valueOf());

    el.onclick = () => {
      this.focus();
    }
    
    return el;
  }

  private createTextArea() {
    const el = document.createElement(this.blockType);
    el.contentEditable = 'true';
    el.className = this._props.className + '-textarea';
    el.id = `boed-block-textarea-${(new Date()).valueOf()}`;
    el.style.outline = 'none';
    el.style.display = 'inline-block';

    el.onfocus = () => {
      this.focus();
    }
    el.onblur = () => {
      this.blur();
    }

    return el;
  }

  private createOperator() {
    const el = document.createElement('span');
    el.innerText = '+';
    el.style.display = 'inline-block';
    el.className = this._props.className + '-operator';
    return el;
  }

  /**
   * 聚焦至该 block
   * @param reset 聚焦后将光标放置在尾部
   */
  public focus(reset=false) {
    // this property can be set.
    // @ts-ignore
    this._blockElement?.className = this._props.className + ' focused';
    this.focused = true;
    // 重新聚焦后，光标可能在最前面，这段代码可以修复
    if (this._textareaElement && reset) {
      const range = document.createRange();
      range.selectNodeContents(this._textareaElement);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }

  public blur() {
    // this property can be set.
    // @ts-ignore
    this._blockElement?.className = this._props.className;
    this.focused = false;
  }

  private set focused(value: boolean) {
    if (value) {
      this._textareaElement?.focus();
    } else {
      this._textareaElement?.blur();
    }
  }

  public get focused() {
    return this._textareaElement?.id === document.activeElement?.id;
  }

  public get target() {
    return this._blockElement;
  }

  private get blockType() :keyof HTMLElementTagNameMap {
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