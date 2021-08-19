import {Component, Input} from '@angular/core';
import {BaseItemComponent} from '../base-item/base-item.component';

@Component({
    selector: 'app-item-new',
    templateUrl: './item-new.component.html',
    styleUrls: ['./item-new.component.scss']
})
export class ItemNewComponent extends BaseItemComponent {

    @Input() parentaccess = true;
    @Input() title = '';
    @Input() action = '';
    @Input() targetType = '';
    @Input() do = '';
    @Input() id = '';
    @Input() pid = '';

    @Input() pageEdit = false;
    @Input() pageId = 0;

    @Input() base = '';
    @Input() rt = '';

    click(): void {

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
