import { Block, PlainBlock, BlockType } from "./components/block";
import DOMHandler from "./components/dom";

export default class BlockPool {
  private _blocks: Block[];

  constructor(private workspace: HTMLElement) {
    this._blocks = [];
    // add a new block, PlainBlock is default
    this.add(new PlainBlock());
  }

  /**
   * 在指定的元素之后插入新的 Block
   * @param target target element or Block
   * @param type BlockType, 'plain' is default
   */
  public insertAfterElement(target: HTMLElement, type: BlockType = 'plain') {
    this.insertAfter(target, type);
  }

  public insertAfterBlock(target: Block, type: BlockType = 'plain') {
    this.insertAfter(target, type);
  }

  public add(b: Block) {
    this._blocks.push(b);
    this.renderLast(b);
    this.focusOn(b);
  }

  /**
   * remove a block
   * @param el BaseBlock or HTMLElment
   */
  public removeByElement(el: HTMLElement) {
    this.removeBy(el);
  }

  public removeByBlock(b: Block) {
    this.removeBy(b);
  }

  public click(el: HTMLElement) {
    const b = this.findBlock(el);
    b?.click();
  }

  /**
   * find index of a Block
   * @param b BaseBlock
   * @returns index of the Block in blocks
   */
  private indexOf(b: Block) {
    return this._blocks.indexOf(b);
  }

  private focusOn(b: Block) {
    b.focus();
  }

  private renderLast(b: Block) {
    const el = b.create();
    this.workspace.append(el);
    return el;
  }

  private renderAfter(targetBlock: Block, newBlock: Block) {
    const targetEl = this.blockTarget(targetBlock);
    const newEl = newBlock.create();
    DOMHandler.insertAfter(targetEl, newEl);
    return newEl;
  }

  private insertAfter(target: Block | HTMLElement, type: BlockType) {
    let targetBlock = target instanceof HTMLElement ? this.findBlock(target) : target;
    let newBlock: Block;

    switch(type) {
      case 'plain':
        newBlock = new PlainBlock();
        break;
      default:
        newBlock = new PlainBlock();
        break;
    }

    if (targetBlock) {
      this._blocks.push(newBlock);
      this.renderAfter(targetBlock, newBlock);
      this.focusOn(newBlock);
    }
  }

  private removeBy(target: Block | HTMLElement, reset=false) {
    const b = target instanceof Block ? target : this.findBlock(target);

    if (b && this._blocks.length > 1) {
      const idx = this.indexOf(b);
      if (idx >= 0) {
        // 删除这个 Block
        this._blocks.splice(idx, 1);
        // 销毁这个 Block
        b.destory();
        // 聚焦至上一个 Block
        const before = this._blocks[idx-1];
        if (before) this.focusOn(before);
      }
    }
  }

  private blockTarget(b: Block) {
    return this.workspace.querySelector(`#${b.json.id}`) as HTMLElement;
  }

  private findBlock(el: HTMLElement) {
    for (const b of this._blocks) {
      if (b.target === el || b.target?.contains(el)) {
        return b;
      }
    }
    return null;
  }
}
