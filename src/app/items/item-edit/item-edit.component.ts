import {Component, Input} from '@angular/core';
import {BaseItemComponent} from '../base-item/base-item.component';

@Component({
    selector: 'app-item-edit',
    templateUrl: './item-edit.component.html',
    styleUrls: ['./item-edit.component.scss']
})
export class ItemEditComponent extends BaseItemComponent {

    @Input() access = true;
    @Input() title = '';
    @Input() action = '';
    @Input() targetType = '';
    @Input() do = '';
    @Input() id = '';

    @Input() pageEdit = false;
    @Input() pageId = 0;

    click(): void {

        this.dispatchEvent({
            dialog: true,
            action: this.action,
            targetType: this.targetType,
            do: this.do,
            id: this.id,
            pageEdit: this.pageEdit,
            pageId: this.pageId
        });

    }

}
