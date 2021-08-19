import {Component, Input} from '@angular/core';
import {BaseItemComponent} from '../base-item/base-item.component';

@Component({
    selector: 'app-item-filemanagement',
    templateUrl: './item-filemanagement.component.html',
    styleUrls: ['./item-filemanagement.component.scss']
})
export class ItemFilemanagementComponent extends BaseItemComponent {

    @Input() title = '';
    @Input() targetType = '';
    @Input() do = '';

    @Input() pageEdit = false;
    @Input() pageId = 0;

    click(): void {

        this.dispatchEvent({
            dialog: true,
            targetType: this.targetType,
            do: this.do,
            pageEdit: this.pageEdit,
            pageId: this.pageId
        });

    }

}

