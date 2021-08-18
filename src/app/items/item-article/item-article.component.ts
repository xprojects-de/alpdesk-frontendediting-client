import {Component, Input} from '@angular/core';
import {BaseItemComponent} from '../base-item/base-item.component';

@Component({
    selector: 'app-item-article',
    templateUrl: './item-article.component.html',
    styleUrls: ['./item-article.component.scss']
})
export class ItemArticleComponent extends BaseItemComponent {

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
