import BlockPool from "./pool";

export interface Options {
  mountNode?: HTMLElement | null;
}

export default class Boed {
  private _blockPool: BlockPool | null;
  private _defaultOptions: Options = {
    mountNode: document.querySelector('#boedjs') as HTMLElement,
  };

  constructor(private _options: Options) {
    this._options = { ...this._defaultOptions, ..._options };
    if (this._options.mountNode) {
      this._blockPool = new BlockPool(this._options.mountNode);
    } else {
      const el = document.createElement('div');
      el.id = 'boedjs';
      document.appendChild(el);
      this._blockPool = new BlockPool(el);
    }

    this.listen('click', this.handleClick);
    this.listen('keydown', this.handleKeydown);
  }

  private handleClick(evt: HTMLElementEventMap['click'], that: Boed) {
    const target = evt.target as HTMLElement;
    that?._blockPool?.onClick(target);
  }

  private handleKeydown(evt: HTMLElementEventMap['keydown'], that: Boed) {
    const target = evt.target as HTMLElement;

    console.log('key: ', evt.key);

    if (evt.key === 'Enter') {
      evt.preventDefault();
      that?._blockPool?.onEnter(target);
      that?._blockPool?.insertAfter(target);
    }

    if (evt.key === 'Backspace') {
      that?._blockPool?.onBackspace(target);
      if (!target.innerText) {
        // avoid to delete the last word of the line before
        evt.preventDefault();
        that?._blockPool?.remove(target);
      }
    }

    if (evt.key === 'ArrowUp') {
      const sel = window.getSelection();
      if (sel?.anchorOffset === 0) {
        that?._blockPool?.focusBefore(target);
      }
    }

    if (evt.key === 'ArrowDown') {
      const sel = window.getSelection();
      if (sel && sel?.anchorOffset > target.innerText.length - 1) {
        that?._blockPool?.focusAfter(target);
      }
    }
  }

  private listen(evtName: keyof HTMLElementEventMap, handler: (evt: any, that: Boed) => void) {
    const that = this;
    this._options.mountNode?.addEventListener(evtName, (evt) => {
      handler(evt, that);
    });
  }
}