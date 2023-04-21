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
  public focusedBlock = new Proxy<{
    value?: Block,
    focus?(): void,
    focused?: boolean,
  }>({}, {
    set(target, prop, value) {
      if (prop === 'value') {
        console.info(target, prop, value);
        target.value = value;
        target.value?.focus();
        return true;
      }
      if (prop === 'blur') {
        target.value?.blur();
        return true;
      }
      return true;
    },
    get(target, prop) {
      if (prop === 'focused') return target.value?.focused;
      if (prop === 'value') return target.value;
    }
  })

  private _blocks: Block[] = [];

  private _defaultOptions: Options = {
    mountNode: '#boedjs',
  };

  constructor(private _options: Options) {
    this.mergeOpts();
    if (this._options.header) this.loadHeader();
    if (this._options.footer) this.loadFooter();
    this.loadContainer();
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
    this.appedDefaultBlock();
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
        if (!target.innerText.trim()) return;

        // 如果焦点在编辑器上，插入新的 block
        if (this.focusedBlock?.focused) {
          // 创建新 block
          const b = new Block();
          this._blocks.push(b);
          const el = b.create();
          if (this.focusedBlock.value?.target) {
            insertAfter(el, this.focusedBlock?.value?.target);
            // 聚焦至新的 block;
            this.focusedBlock.value = b;
          }
        }
      }
    }
    el.onclick = (evt) => {
      const target = evt.target as HTMLElement;
      target.focus();
    }
    el.onfocus = (evt) => {
      const target = evt.target as HTMLElement;
      target.focus();
    }
    return el;
  }

  private mergeOpts() {
    this._options = {...this._defaultOptions, ...this._options};
  }

  private appedDefaultBlock() {
    if (this._blocks.length === 0) {
      const b = new Block();
      this._blocks.push(b);
      const el = b.create();
      if (this._containerNode instanceof HTMLElement) {
        this._containerNode.appendChild(el);
        this.focusedBlock.value = b;
      }
    }
  }
}

function insertAfter(newEl: HTMLElement, target: HTMLElement) {
  let parent = target.parentElement;
  if (parent?.lastChild == target) {
    parent.appendChild(newEl);
  } else {
    parent?.insertBefore(newEl, target.nextSibling);
  }
}