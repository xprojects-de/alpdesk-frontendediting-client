import {Component, Input} from '@angular/core';
import {BaseItemComponent} from '../base-item/base-item.component';

@Component({
    selector: 'app-item-drag',
    templateUrl: './item-drag.component.html',
    styleUrls: ['./item-drag.component.scss']
})
export class ItemDragComponent extends BaseItemComponent {

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
