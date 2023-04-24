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
    that?._blocks?.focusOn(target);
  }

  private handleKeydown(evt: HTMLElementEventMap['keydown'], that: Boed) {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      const nb = new Block();
      that?._blocks?.push(nb);
    }

    if (evt.key === 'Backspace') {
      const target = evt.target as HTMLElement;
      if (!target.innerText) {
        that?._blocks?.remove(target);
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