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
    el.style.outline = 'none';
    el.style.margin = '2px 0px';
    el.style.padding = '2px 8px';

    el.onfocus = () => {
      el.style.backgroundColor = '#d1d3d7';
    }
    el.onblur = () => {
      el.style.backgroundColor = '#fff';
    }
    el.onmouseenter = () => {
      el.style.backgroundColor = '#f1f1f1';
    }
    el.onmouseleave = () => {
      el.style.backgroundColor = '#fff';
    }
    el.onkeydown = (evt) => {
      if (evt.key === 'Enter') {

      }
    }
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
}