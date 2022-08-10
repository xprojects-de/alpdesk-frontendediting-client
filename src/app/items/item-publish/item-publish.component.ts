import {Component, Input} from '@angular/core';
import {Constants} from 'src/app/classes/constants';
import {BaseItemComponent} from '../base-item/base-item.component';

@Component({
    selector: 'app-item-publish',
    templateUrl: './item-publish.component.html',
    styleUrls: ['./item-publish.component.scss']
})
export class ItemPublishComponent extends BaseItemComponent {

    @Input() access = true;
    @Input() title = '';
    @Input() action = '';
    @Input() targetType = '';
    @Input() do = '';
    @Input() id = '';
    @Input() pid = '';
    @Input() state = true;

    @Input() pageEdit = false;
    @Input() pageId = 0;

    @Input() base = '';
    @Input() rt = '';

    private generteRequestUrl(): string {

        let url = '';

        if (this.targetType === Constants.TARGETTYPE_CE) {
            url = '/contao?do=' + this.do + '&table=tl_content&id=' + this.id + '&act=toggle&field=invisible&state=' + (this.state ? 1 : 0) + '&rt=' + this.rt;
        } else if (this.targetType === Constants.TARGETTYPE_ARTICLE) {
            url = '/contao?do=' + this.targetType + '&id=' + this.id + '&act=toggle&field=published&state=' + (this.state ? 1 : 0) + '&rt=' + this.rt;
        }

        return url;
    }

    click(): void {

        const url: string = this.generteRequestUrl();
        this.dispatchEvent({
            reloadFrame: true,
            preRequestGet: true,
            url,
            dialog: false,
            action: this.action,
            targetType: this.targetType,
            do: this.do,
            id: this.id,
            pid: this.pid,
            state: this.state,
            pageEdit: this.pageEdit,
            pageId: this.pageId
        });

    }

}
