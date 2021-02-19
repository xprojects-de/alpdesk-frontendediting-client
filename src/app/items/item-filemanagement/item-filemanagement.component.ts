import { Component, Input, OnInit } from '@angular/core';
import { BaseItemComponent } from '../base-item/base-item.component';

@Component({
  selector: 'app-item-filemanagement',
  templateUrl: './item-filemanagement.component.html',
  styleUrls: ['./item-filemanagement.component.scss']
})
export class ItemFilemanagementComponent extends BaseItemComponent {

  @Input() title: string = '';
  @Input() targetType: string = '';
  @Input() do: string = '';

  @Input() pageEdit: boolean = false;
  @Input() pageId: number = 0;

  click() {
    this.dispatchEvent({
      dialog: true,
      targetType: this.targetType,
      do: this.do,
      pageEdit: this.pageEdit,
      pageId: this.pageId
    });
  }

}

