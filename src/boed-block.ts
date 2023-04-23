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
  private _outerElement: HTMLElement | null = null;
  private _containerElement: HTMLElement | null = null;
  private _props: BlockProps = {
    type: 'plain',
    className: 'boed-block',
  };
  private _focused = new Proxy({
    element: this._containerElement,
    value: false,
  }, {
    set(target, prop, value) {
      if (prop === 'element') {
        target['element'] = value;
        return true;
      }
      if (prop === 'value') {
        target.value = value;
        if (target.element && value) {
          target.element.focus();
        } else {
          target.element?.blur();
        }
        return true;
      }
      return false;
    }
  });

  constructor(props?: BlockProps) {
    this._props = {...this._props, ...props};
  }

  get json() :BlockContent {
    return {
      text: this._containerElement?.innerText || '',
      html: this._containerElement?.innerHTML || '',
      className: this._outerElement?.className || '',
      id: this._outerElement?.id || '',
      createAt: this._outerElement?.dataset?.create || '',
      type: this._props.type,
    }
  }

  public create() {
    const outerEl = this.createOuter();
    const containerEl = this.createContainer();
    const operatorEl = this.createOperator();
    outerEl.appendChild(operatorEl);
    outerEl.appendChild(containerEl);

    this._outerElement = outerEl;
    this._containerElement = containerEl;

    return outerEl;
  }

  private createOuter() {
    const el = document.createElement('div');
    el.className = this._props.className;
    el.id = `boed-block-${(new Date()).valueOf()}`;
    el.dataset['create'] = String((new Date()).valueOf());
    
    el.style.margin = '2px 0px';
    el.style.padding = '2px 8px';

    el.onclick = () => {
      this.focus();
    }
    
    return el;
  }

  private createContainer() {
    const el = document.createElement(this.blockType());
    el.contentEditable = 'true';
    el.className = this._props.className + '-container';
    el.id = `boed-block-container-${(new Date()).valueOf()}`;
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

  private blockType() :keyof HTMLElementTagNameMap {
    switch(this._props?.type) {
      case 'plain':
        return 'div';
      case 'link':
        return 'a';
      default:
        return 'div';
    }
  }

  get target() {
    return this._outerElement;
  }

  focus() {
    this._focused.element = this._containerElement;
    // this property can be set.
    // @ts-ignore
    this._outerElement?.className = this._props.className + ' focused';
    this._focused.value = true;
  }

  blur() {
    this._focused.element = this._containerElement;
    // this property can be set.
    // @ts-ignore
    this._outerElement?.className = this._props.className;
    this._focused.value = false;
  }

  get focused() {
    return this._containerElement?.id === document.activeElement?.id;
  }
}