import {Component, Input} from '@angular/core';
import {BaseItemComponent} from '../base-item/base-item.component';

@Component({
    selector: 'app-item-cut',
    templateUrl: './item-cut.component.html',
    styleUrls: ['./item-cut.component.scss']
})
export class ItemCutComponent extends BaseItemComponent {

    @Input() parentaccess = true;
    @Input() title = '';
    @Input() snackTitle = '';
    @Input() action = '';
    @Input() targetType = '';
    @Input() do = '';
    @Input() id = '';

    @Input() pageEdit = false;
    @Input() pageId = 0;

    @Input() base = '';
    @Input() rt = '';

    click(): void {

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
