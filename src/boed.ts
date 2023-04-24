import Blocks from "./blocks";
import Block from "./components/block";

export interface Options {
  mountNode?: HTMLElement | null;
}

export default class Boed {
  private _blocks: Blocks | null;
  private _defaultOptions: Options = {
    mountNode: document.querySelector('#boedjs') as HTMLElement,
  };

  constructor(private _options: Options) {
    this._options = { ...this._defaultOptions, ..._options };
    if (this._options.mountNode) {
      this._blocks = new Blocks(this._options.mountNode);
    } else {
      const el = document.createElement('div');
      el.id = 'boedjs';
      document.appendChild(el);
      this._blocks = new Blocks(el);
    }

    this.listen('click', this.handleClick);
    this.listen('keydown', this.handleKeydown);
  }

  private handleClick(evt: HTMLElementEventMap['click'], that: Boed) {
    const target = evt.target as HTMLElement;
    that?._blocks?.click(target);
  }

  private handleKeydown(evt: HTMLElementEventMap['keydown'], that: Boed) {
    const target = evt.target as HTMLElement;

    if (evt.key === 'Enter') {
      evt.preventDefault();
      const nb = new Block();
      that?._blocks?.insert(target, nb);
    }

    if (evt.key === 'Backspace') {
      if (!target.innerText) {
        evt.preventDefault();
        that?._blocks?.remove(target, true);
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