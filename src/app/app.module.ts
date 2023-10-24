import {BrowserModule} from '@angular/platform-browser';
import {ApplicationRef, DoBootstrap, Injector, NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ItemContainerComponent} from './item-container/item-container.component';
import {ItemDescComponent} from './items/item-desc/item-desc.component';
import {ItemOverviewComponent} from './items/item-overview/item-overview.component';
import {ItemEditComponent} from './items/item-edit/item-edit.component';
import {ItemCopyComponent} from './items/item-copy/item-copy.component';
import {ItemPublishComponent} from './items/item-publish/item-publish.component';
import {ItemDeleteComponent} from './items/item-delete/item-delete.component';
import {ItemNewComponent} from './items/item-new/item-new.component';
import {BaseItemComponent} from './items/base-item/base-item.component';
import {ItemParentComponent} from './items/item-parent/item-parent.component';
import {ItemPageComponent} from './items/item-page/item-page.component';
import {ItemArticleComponent} from './items/item-article/item-article.component';
import {ItemCustomModuleComponent} from './items/item-custom-module/item-custom-module.component';
import {ItemMoveComponent} from './items/item-move/item-move.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {ModalIframeComponent} from './utils/modal-iframe/modal-iframe.component';
import {createCustomElement} from '@angular/elements';
import {HttpClientModule} from '@angular/common/http';
import {ItemBarDirective} from './directives/item-bar.directive';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {FormsModule} from '@angular/forms';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/legacy-progress-spinner';
import {ItemCutComponent} from './items/item-cut/item-cut.component';
import {ItemDragComponent} from './items/item-drag/item-drag.component';
import {ItemPasteAfterComponent} from './items/item-paste-after/item-paste-after.component';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {ItemFilemanagementComponent} from './items/item-filemanagement/item-filemanagement.component';
import {DraggableElementsComponent} from './draggable-elements/draggable-elements.component';
import {MatLegacyChipsModule as MatChipsModule} from '@angular/material/legacy-chips';

@NgModule({
    declarations: [
        AppComponent,
        ItemContainerComponent,
        ItemDescComponent,
        ItemOverviewComponent,
        ItemEditComponent,
        ItemCopyComponent,
        ItemPublishComponent,
        ItemDeleteComponent,
        ItemNewComponent,
        BaseItemComponent,
        ItemParentComponent,
        ItemPageComponent,
        ItemArticleComponent,
        ItemCustomModuleComponent,
        ItemMoveComponent,
        ModalIframeComponent,
        ItemBarDirective,
        ItemCutComponent,
        ItemDragComponent,
        ItemPasteAfterComponent,
        ItemFilemanagementComponent,
        DraggableElementsComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatButtonModule,
        DragDropModule,
        MatIconModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatChipsModule
    ],
    providers: [],
    bootstrap: []
})
export class AppModule implements DoBootstrap {

    constructor(private injector: Injector) {
    }

    ngDoBootstrap(appRef: ApplicationRef): void {

        customElements.define('app-alpdeskfee', createCustomElement(AppComponent, {injector: this.injector}));

        /*if (document.querySelectorAll('app-root')) {
            appRef.bootstrap(AppComponent);
        }*/

    }
}
