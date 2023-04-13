type Mount = string | Element;

interface Options {
  mount?: Mount;
}

export default class Boed {
  private _mount: Element = document.querySelector('#boedjs') || document.body;
  private _options: Options = {};

  constructor(options: Options) {
    if (options?.mount) {
      this.mount = options.mount;
    }

    this.initialize();
  }

  initialize() {
    this._mount.innerHTML = '<div class="boed-container">BoedJS</div>';
  }

  set mount(value: Mount) {
    if (typeof value === 'string') {
      this._mount = document.querySelector(value) || document.body;
    } else if (value instanceof Element) {
      this._mount = value;
    } else {
      throw new Error("mount must be string or Element");
    }
  }
}