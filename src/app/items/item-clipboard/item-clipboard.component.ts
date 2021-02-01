import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Constants } from 'src/app/classes/constants';
import { BaseItemComponent } from '../base-item/base-item.component';

@Component({
  selector: 'app-item-clipboard',
  templateUrl: './item-clipboard.component.html',
  styleUrls: ['./item-clipboard.component.scss']
})
export class ItemClipboardComponent extends BaseItemComponent implements OnChanges {

  @Input() title: string = '';
  @Input() pasteafterid: number = 0;
  @Input() pasteAfterMode: string = Constants.CLIPBOARDMODE_INVALID;

  show = false;

  ngOnChanges() {
    this.show = false;
    if (this.pasteAfterMode === Constants.CLIPBOARDMODE_CUT || this.pasteAfterMode === Constants.CLIPBOARDMODE_COPY) {
      if (this.pasteafterid !== 0) {
        this.show = true;
      }
    } 
  }

  click() {
    
  }

}
