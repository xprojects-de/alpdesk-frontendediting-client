import { Component, Input, OnChanges } from '@angular/core';
import { Constants } from 'src/app/classes/constants';
import { BaseItemComponent } from '../base-item/base-item.component';

@Component({
  selector: 'app-item-paste-after',
  templateUrl: './item-paste-after.component.html',
  styleUrls: ['./item-paste-after.component.scss']
})
export class ItemPasteAfterComponent extends BaseItemComponent implements OnChanges {

  @Input() parentaccess: boolean = true;
  @Input() title: string = '';
  @Input() action: string = '';
  @Input() targetType: string = '';
  @Input() do: string = '';
  @Input() id: string = '';
  @Input() pasteafterid: number = 0;
  @Input() pasteAfterMode: string = Constants.CLIPBOARDMODE_INVALID;
  @Input() pasteAfterTarget: string = Constants.CLIPBOARDMODE_PASTETARGET_CE;
  @Input() pasteAfterPtable: string = Constants.CLIPBOARDPTABLE_INVALID;

  @Input() pageEdit: boolean = false;
  @Input() pageId: number = 0;

  @Input() base: string = '';
  @Input() rt: string = '';

  show = false;

  private generteRequestUrl(): string {
    let url: string = '';
    if (this.targetType === Constants.TARGETTYPE_CE || this.targetType === Constants.TARGETTYPE_ARTICLE) {
      url = '/contao?do=' + this.do + '&table=tl_content&act=' + this.pasteAfterMode + '&mode=' + this.pasteAfterTarget + '&pid=' + this.id + '&id=' + this.pasteafterid + '&rt=' + this.rt;
    }
    return url;
  }

  ngOnChanges() {

    this.show = false;
    let tmp = false;
    
    if (this.pasteAfterMode === Constants.CLIPBOARDMODE_CUT) {
      if (this.pasteAfterTarget === Constants.CLIPBOARDMODE_PASTETARGET_CE && this.pasteafterid !== 0 && this.pasteafterid !== Number(this.id) && this.parentaccess === true) {
        tmp = true;
      } else if (this.pasteAfterTarget === Constants.CLIPBOARDMODE_PASTETARGET_ARTICLE && this.pasteafterid !== 0 && this.parentaccess === true) {
        tmp= true;
      }
    } else if (this.pasteAfterMode === Constants.CLIPBOARDMODE_COPY) {
      if (this.pasteafterid !== 0 && this.parentaccess === true) {
        tmp = true;
      }
    }

    if(tmp === true && this.pasteAfterPtable !== Constants.CLIPBOARDPTABLE_INVALID) {
      if(this.pasteAfterPtable !== this.do) {
        tmp = false;
      }
    }

    this.show = tmp;

  }

  click() {
    const url: string = this.generteRequestUrl();
    this.dispatchEvent({
      reloadFrame: true,
      preRequestGet: true,
      updateBag: true,
      url: url,
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
