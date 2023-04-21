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

export default class Block {
  private _el: HTMLElement | null = null;
  private _props: BlockProps = {
    type: 'plain',
    className: 'boed-block',
  };

  constructor(props?: BlockProps) {
    this._props = {...this._props, ...props};
  }

  public create() {
    const el = document.createElement(this.blockType());
    el.contentEditable = 'true';
    el.className = this._props.className;
    el.id = `boed-block-${(new Date()).valueOf()}`;
    el.dataset['create'] = String((new Date()).valueOf());
    el.style.outline = 'none';
    el.style.margin = '2px 0px';
    el.style.padding = '2px 8px';
    el.style.backgroundColor = '#f1f1f1';

    el.onclick = () => {
      el.focus();
    }
    el.onfocus = () => {
      el.style.backgroundColor = '#d1d3d7';
    }
    el.onblur = () => {
      el.style.backgroundColor = '#f1f1f1';
    }
    el.onmouseenter = () => {
      el.style.backgroundColor = '#dddddd';
    }
    el.onmousemove = () => {
      el.style.backgroundColor = '#dddddd';
    }
    el.onmouseleave = () => {
      el.style.backgroundColor = '#f1f1f1';
    }
    el.onkeydown = (evt) => {
      if (evt.key === 'Enter') {

      }
    }

    this._el = el;

    return el;
  }

  private blockType() :keyof HTMLElementTagNameMap {
    switch(this._props?.type) {
      case 'plain':
        return 'div';
      default:
        return 'div';
    }
  }

  get target() {
    return this._el;
  }

  focus() {
    this.focused = true;
  }

  blur() {
    this._el?.blur();
  }

  set focused(value: boolean) {
    if (value) {
      this._el?.focus();
    } else {
      this._el?.blur();
    }
  }

  get focused() {
    return this._el?.id === document.activeElement?.id;
  }
}