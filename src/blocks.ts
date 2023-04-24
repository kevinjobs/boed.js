import Block from "./components/block";

export default class Blocks {
  private _blocks: Block[];

  constructor(private workspace: HTMLElement) {
    this._blocks = [];
    // add a new block default
    this.push(new Block());
  }

  private focusOn(b: Block, reset=false) {
    b.focus(reset);
  }

  public insert(target: Block | HTMLElement, newBlock: Block) {
    let targetBlock: Block | null = null;
    if (target instanceof Block) {
      targetBlock = target;
    } else if (target instanceof HTMLElement) {
      targetBlock = this.findBlock(target);
    }

    if (targetBlock) {
      this._blocks.push(newBlock);
      this.renderAfter(targetBlock, newBlock);
      this.focusOn(newBlock);
    }
  }

  public push(b: Block) {
    this._blocks.push(b);
    this.renderLast(b);
    this.focusOn(b);
  }

  /**
   * remove a block
   * @param el Block or HTMLElment
   */
  public remove(el: Block | HTMLElement, reset=false) {
    let b: Block | null = null;

    if (el instanceof Block) {
      b = el;
    } else if (el instanceof HTMLElement) {
      b = this.findBlock(el);
    }

    if (b && this._blocks.length > 1) {
      const idx = this.indexOf(b);
      if (idx >= 0) {
        this._blocks.splice(idx, 1);
        b.destory();
        const before = this._blocks[idx-1];
        if (before) this.focusOn(before, reset);
      }
    }
  }

  // alias for remove
  public del(b: Block) {
    this.remove(b);
  }

  public click(target: Block | HTMLElement) {
    if (target instanceof Block) {
      this.focusOn(target);
    } else if (target instanceof HTMLElement) {
      const b = this.findBlock(target);
      b && this.focusOn(b);
    }
  }

  public indexOf(b: Block) {
    return this._blocks.indexOf(b);
  }

  private renderLast(b: Block) {
    const el = b.create();
    this.workspace.append(el);
    return el;
  }

  private renderAfter(targetBlock: Block, newBlock: Block) {
    const targetEl = this.blockTarget(targetBlock);
    const newEl = newBlock.create();
    Blocks.insertElementAfter(targetEl, newEl);
    return newEl;
  }

  private blockTarget(b: Block) {
    return this.workspace.querySelector(`#${b.id}`) as HTMLElement;
  }

  private findBlock(el: HTMLElement) {
    for (const b of this._blocks) {
      if (b.target === el || b.target?.contains(el)) {
        return b;
      }
    }
    return null;
  }

  private static insertElementAfter(target: HTMLElement | null, newEl: HTMLElement) {
    if (!target) return;
  
    let parent = target.parentElement;
    if (parent?.lastChild == target) {
      parent.appendChild(newEl);
    } else {
      parent?.insertBefore(newEl, target.nextSibling);
    }
  }
}
