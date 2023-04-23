import Block from "./boed-block";

type BoedNode = string | HTMLElement;

export interface Options {
  mountNode?: BoedNode;
  header?: boolean | BoedHeader;
  footer?: boolean | BoedFooter;
}

export class BoedHeader {}

export class BoedFooter {}

export default class Boed {
  private _mountNode: BoedNode | null = document.querySelector<HTMLElement>('#boedjs');
  private _headerNode: BoedNode | null = null;
  private _containerNode: BoedNode | null = null;
  private _footerNode: BoedNode | null = null;
  private _blocks: Block[] = [];
  private _defaultOptions: Options = { mountNode: '#boedjs' };

  public currentBlock: Block | null = null;

  constructor(private _options: Options) {
    this.mergeOpts();
    if (this._options.header) this.loadHeader();
    if (this._options.footer) this.loadFooter();
    this.loadContainer();
  }

  get blocks() {
    return this._blocks;
  }

  private loadHeader() {
    //
  }

  private loadFooter() {
    //
  }

  private loadContainer() {
    this._containerNode = this.createContainerNode();
    if (this._mountNode instanceof HTMLElement) {
      this._mountNode.appendChild(this._containerNode);
    }
    if (this._blocks.length === 0) {
      const b = new Block();
      this._blocks.push(b);
      const el = b.create();
      if (this._containerNode instanceof HTMLElement) {
        this._containerNode.appendChild(el);
        this.setFocus(b);
      }
    }
  }

  private createContainerNode() {
    const el = document.createElement('div');
    el.id = 'boed-container';
    el.style.margin = '0px';

    el.onkeydown = (evt) => {
      if (evt.key === 'Enter') {
        evt.preventDefault();
        evt.stopPropagation();

        const target = evt.target as HTMLElement;
        // 如果行内没有输入任何字符或者都是空格，则回车无效
        // to-do: 是否允许空行需要考虑
        if (!target.innerText.trim()) return;

        // 如果焦点在编辑器上，插入新的 block
        if (this.currentBlock?.focused) {
          // 创建新 block
          const b = new Block();
          this._blocks.push(b);
          const el = b.create();
          insertAfter(el, this.currentBlock?.target);
          // 聚焦至新的 block;
          this.setFocus(b);
        }
      }
    }
    el.onclick = (evt) => {
      const target = evt.target as HTMLElement;
      const b = this.findBlock(target);
      if (b) this.setFocus(b);
    }
    el.onfocus = (evt) => {
      const target = evt.target as HTMLElement;
      const b = this.findBlock(target);
      if (b) this.setFocus(b);
    }
    return el;
  }

  private mergeOpts() {
    this._options = {...this._defaultOptions, ...this._options};
  }

  private setFocus(block: Block) {
    this.currentBlock = block;
    this.currentBlock.focus();
  }

  private findBlock(el: HTMLElement) {
    for (const b of this._blocks) {
      if (b.target == el) return b;
    }
  }
}

function insertAfter(newEl: HTMLElement, target: HTMLElement | null = null) {
  if (!target) return;

  let parent = target.parentElement;
  if (parent?.lastChild == target) {
    parent.appendChild(newEl);
  } else {
    parent?.insertBefore(newEl, target.nextSibling);
  }
}