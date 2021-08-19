import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {BaseItemComponent} from '../base-item/base-item.component';

@Component({
    selector: 'app-item-custom-module',
    templateUrl: './item-custom-module.component.html',
    styleUrls: ['./item-custom-module.component.scss']
})
export class ItemCustomModuleComponent extends BaseItemComponent implements OnInit, OnChanges {

    @Input() title = '';
    @Input() targetType = '';
    @Input() do = '';
    @Input() iconclass = '';
    @Input() icon = '../../../system/themes/flexible/icons/modules.svg';

    @Input() pageEdit = false;
    @Input() pageId = 0;

    iconDefault = '../../../system/themes/flexible/icons/modules.svg';
    iconUrl = '';

    ngOnInit(): void {
        this.setIcon();
    }

    ngOnChanges(): void {
        this.setIcon();
    }

    private setIcon(): void {

        if (this.icon !== null && this.icon !== '' && this.icon !== undefined) {
            this.iconUrl = 'url(\'' + this.icon + '\')';
        } else {
            this.iconUrl = 'url(\'' + this.iconDefault + '\')';
        }

    }

    click(): void {

        this.dispatchEvent({
            dialog: true,
            targetType: this.targetType,
            do: this.do,
            iconclass: this.iconclass,
            icon: this.icon,
            pageEdit: this.pageEdit,
            pageId: this.pageId
        });

    }

}
