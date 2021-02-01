import { Component, Input } from '@angular/core';
import { BaseItemComponent } from '../base-item/base-item.component';

@Component({
  selector: 'app-item-copy',
  templateUrl: './item-copy.component.html',
  styleUrls: ['./item-copy.component.scss']
})
export class ItemCopyComponent extends BaseItemComponent {

  @Input() title: string = '';
  @Input() snackTitle: string = '';
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
      updateClipboard: true,
      snackMsg: this.snackTitle + ': ID ' + this.id,
      rt: this.rt,
      url: '/contao/alpdeskfee',
      dialog: false,
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
