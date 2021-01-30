import { Component, Input, OnChanges } from '@angular/core';
import { Constants } from 'src/app/classes/constants';
import { BaseItemComponent } from '../base-item/base-item.component';

@Component({
  selector: 'app-item-paste-after',
  templateUrl: './item-paste-after.component.html',
  styleUrls: ['./item-paste-after.component.scss']
})
export class ItemPasteAfterComponent extends BaseItemComponent implements OnChanges {

  @Input() title: string = '';
  @Input() action: string = '';
  @Input() targetType: string = '';
  @Input() do: string = '';
  @Input() id: string = '';
  @Input() pasteafterid: number = 0;
  @Input() pasteAfterMode: string = Constants.CLIPBOARDMODE_INVALID;

  @Input() pageEdit: boolean = false;
  @Input() pageId: number = 0;

  @Input() base: string = '';
  @Input() rt: string = '';

  show = false;

  private generteRequestUrl(): string {
    let url: string = '';
    if (this.targetType === Constants.TARGETTYPE_CE) {
      // https://contao.local:8890/contao?do=article&table=tl_content&id=234&act=copy&mode=1&pid=234&rt=oKoDxE5y71cRvpg4w29vrNqxNeqbEUQWMza_kvsmnYs&ref=POG7YPs7
      url = '/contao?do=' + this.do + '&table=tl_content&act=' + this.pasteAfterMode + '&mode=1&pid=' + this.id + '&id=' + this.pasteafterid + '&rt=' + this.rt;
    }
    return url;
  }

  ngOnChanges() {
    this.show = false;
    if (this.pasteAfterMode === Constants.CLIPBOARDMODE_CUT) {
      if (this.pasteafterid !== 0 && this.pasteafterid !== Number(this.id)) {
        this.show = true;
      }
    } else if (this.pasteAfterMode === Constants.CLIPBOARDMODE_COPY) {
      if (this.pasteafterid !== 0) {
        this.show = true;
      }
    }
  }

  click() {
    const url: string = this.generteRequestUrl();
    this.dispatchEvent({
      reloadFrame: true,
      preRequestGet: true,
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
