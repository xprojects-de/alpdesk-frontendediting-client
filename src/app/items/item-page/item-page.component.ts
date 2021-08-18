import {Component, Input} from '@angular/core';
import {BaseItemComponent} from '../base-item/base-item.component';

@Component({
    selector: 'app-item-page',
    templateUrl: './item-page.component.html',
    styleUrls: ['./item-page.component.scss']
})
export class ItemPageComponent extends BaseItemComponent {

    @Input() title = '';
    @Input() action = '';
    @Input() targetType = '';
    @Input() do = '';

    @Input() pageEdit = false;
    @Input() pageId = 0;

    click(): void {

        this.dispatchEvent({
            dialog: true,
            action: this.action,
            targetType: this.targetType,
            do: this.do,
            pageEdit: this.pageEdit,
            pageId: this.pageId
        });

    }

}
