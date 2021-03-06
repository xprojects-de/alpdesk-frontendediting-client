import { Component, Input } from '@angular/core';
import { BaseItemComponent } from '../base-item/base-item.component';

@Component({
  selector: 'app-item-drag',
  templateUrl: './item-drag.component.html',
  styleUrls: ['./item-drag.component.scss']
})
export class ItemDragComponent extends BaseItemComponent {

  @Input() title: string = '';
  @Input() action: string = '';
  @Input() targetType: string = '';
  @Input() do: string = '';
  @Input() id: string = '';
  @Input() pid: string = '';

  @Input() pageEdit: boolean = false;
  @Input() pageId: number = 0;

  @Input() base: string = '';
  @Input() rt: string = '';

  click() {
    this.dispatchEvent({
      preRequestPost: true,
      rt: this.rt,
      url: '/contao/alpdeskfee',
      dialog: true,
      action: this.action,
      targetType: this.targetType,
      do: this.do,
      id: this.id,
      pid: this.pid,
      pageEdit: this.pageEdit,
      pageId: this.pageId
    });
  }

}