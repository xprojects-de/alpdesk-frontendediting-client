import {Component, Input} from '@angular/core';
import {BaseItemComponent} from '../base-item/base-item.component';

@Component({
    selector: 'app-item-parent',
    templateUrl: './item-parent.component.html',
    styleUrls: ['./item-parent.component.scss']
})
export class ItemParentComponent extends BaseItemComponent {

    @Input() title = '';
    @Input() action = '';
    @Input() targetType = '';
    @Input() do = '';
    @Input() id = '';
    @Input() pid = '';

    @Input() pageEdit = false;
    @Input() pageId = 0;

    click(): void {

        this.dispatchEvent({
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
