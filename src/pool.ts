import { Block, PlainBlock, BlockType } from "./components/block";
import DOMHandler from "./components/dom";

export default class BlockPool {
  private _blocks: Block[];

  constructor(private workspace: HTMLElement) {
    this._blocks = [];
    // add a new block, PlainBlock is default
    this.add(new PlainBlock());
  }

  public add(b: Block) {
    this._blocks.push(b);
    if (b.targetElement) this.workspace.appendChild(b.targetElement);
    // 添加新的 block 自动聚焦
    this.focusOn(b);
  }

  public remove(target: Block | HTMLElement) {
    const b = target instanceof Block ? target : this.findBlock(target);

    if (b && this._blocks.length > 1) {
      const idx = this.indexOf(b);

      console.log('index: ', idx);

      if (idx >= 0) {
        // 删除这个 Block
        this._blocks.splice(idx, 1);
        // 销毁这个 Block
        b.destory();
        // 聚焦至上一个 Block
        // 如果是第一个被删除，则聚焦到递补上来的第一个
        const before = this._blocks[idx-1];
        if (before) {
          this.focusOn(before)
        } else {
          this.focusOn(this._blocks[0]);
        }
      }
    }
  }

  public insertAfter(target: Block | HTMLElement, type: BlockType = 'paragraph') {
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
      const idx = this.indexOf(targetBlock);
      // 新增的 block 插入到指定位置
      this._blocks.splice(idx+1, 0, newBlock);
      // 渲染 dom
      if (targetBlock.targetElement && newBlock.targetElement) {
        DOMHandler.insertAfter(targetBlock.targetElement, newBlock.targetElement);
      }
      // 聚焦至新的 block
      this.focusOn(newBlock);
    }
  }

  public onBackspace(el: HTMLElement) {
    console.log('current block index: ', this.indexOf(el));
  }

  public onEnter(el: HTMLElement) {
    //
  }

  public onClick(el: HTMLElement) {
    const b = this.findBlock(el);
    if (b) this.focusOn(b);
  }

  /**
   * find index of a Block
   * @param b BaseBlock
   * @returns index of the Block in blocks
   */
  private indexOf(target: Block | HTMLElement) {
    if (target instanceof Block) {
      return this._blocks.indexOf(target);
    } else {
      const b = this.findBlock(target);
      if (b) return this._blocks.indexOf(b);
    }
    return -1;
  }

  private findBlock(el: HTMLElement) {
    for (const b of this._blocks) {
      if (b.isEqual(el)) return b;
    }
  }

  private focusOn(block: Block) {
    for (const b of this._blocks) {
      if (b === block) b.focus();
      else b.blur();
    }
  }
}
