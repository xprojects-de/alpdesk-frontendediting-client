import { Component, Input } from '@angular/core';
import { Constants } from 'src/app/classes/constants';
import { BaseItemComponent } from '../base-item/base-item.component';

@Component({
  selector: 'app-item-cut',
  templateUrl: './item-cut.component.html',
  styleUrls: ['./item-cut.component.scss']
})
export class ItemCutComponent extends BaseItemComponent {

  @Input() title: string = '';
  @Input() snackTitle: string = '';
  @Input() action: string = '';
  @Input() targetType: string = '';
  @Input() do: string = '';
  @Input() id: string = '';

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
      pageEdit: this.pageEdit,
      pageId: this.pageId
    });
  }

}
