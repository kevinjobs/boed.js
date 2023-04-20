import Block from "./boed-block";

type Mount = string | Element;

interface Options {
  mountNode?: Mount;
}

export default class Boed {
  private _mountNode: Element = document.querySelector('#boedjs') || document.body;
  private _containerNode: Element | null = null;
  private _block = new Proxy<{
    focused: HTMLElement | null,
    items: Block[],
    newItem: Block | null,
  }>({focused: null, items: [], newItem: null}, {
    set(target, property, value) {
      if (property === 'newItem') {
        target.items.push(value);
        
        if (target.focused) {
          const n = value.create();
          insertAfter(n, target.focused);
          target.focused = n;
        }
      }
      if (property === 'focused') {
        target.focused = value;
      }

      return true;
    },
  });
  private _focusedBlockEl: HTMLElement | null = null;
  private _options: Options = {};

  constructor(options: Options) {
    if (options?.mountNode) {
      this.mountNode = options.mountNode;
    }

    this.initialize();
  }

  private initialize() {
    this._containerNode = this.createContainerNode();
    this._mountNode.appendChild(this._containerNode);
    const firstBlock = (new Block()).create();
    this._containerNode.appendChild(firstBlock);
    firstBlock.focus();
    this._focusedBlockEl = firstBlock;
  }

  private createContainerNode() {
    const el = document.createElement('div');
    el.id = 'boed-container';
    el.style.margin = '0';

    el.onkeydown = (evt) => {
      // evt.preventDefault();
      if (evt.key === 'Enter') {
        const target = evt?.target as HTMLElement;

        evt.preventDefault();
        evt.stopPropagation();

        // 如果行内没有输入任何字符或者都是空格，则回车无效
        if (!target.innerText.trim()) return;

        this._block.focused = this._focusedBlockEl;
        this._block.newItem = new Block();
        this._focusedBlockEl = this._block.focused;
        this._focusedBlockEl?.focus();
      }
    }
    el.onclick = (evt) => {
      this._focusedBlockEl = evt.target as HTMLElement;
    }
    return el;
  }

  set mountNode(value: Mount) {
    if (typeof value === 'string') {
      this._mountNode = document.querySelector(value) || document.body;
    } else if (value instanceof Element) {
      this._mountNode = value;
    } else {
      throw new Error("mount must be string or Element");
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