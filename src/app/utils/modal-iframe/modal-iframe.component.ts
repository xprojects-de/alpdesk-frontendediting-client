import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';
import {fromEvent, Subscription} from 'rxjs';

export interface DialogData {
    url: string;
    reloadAfterInit: boolean;
}

@Component({
    selector: 'app-modal-iframe',
    templateUrl: './modal-iframe.component.html',
    styleUrls: ['./modal-iframe.component.scss']
})
export class ModalIframeComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('alpdeskfeemodalspinner') alpdeskfeemodalspinner!: ElementRef;
    @ViewChild('alpdeskfeemodalframe') alpdeskfeemodalframe!: ElementRef;

    private saveNcloseTrigger = false;
    private saveNclose$!: Subscription;
    private saveNcloseUrl = '';
    private save$!: Subscription;
    private history: string[] = [];
    private historyInit = '';

    url: any;
    showBack = false;

    constructor(private _sanitizer: DomSanitizer, public dialogRef: MatDialogRef<ModalIframeComponent>, @Inject(MAT_DIALOG_DATA) public dataRef: DialogData) {
    }

    ngOnInit(): void {
        this.url = this._sanitizer.bypassSecurityTrustResourceUrl(this.dataRef.url);
    }

    ngAfterViewInit(): void {

        if (this.alpdeskfeemodalframe !== null && this.alpdeskfeemodalframe !== undefined) {
            this.alpdeskfeemodalframe.nativeElement.style.opacity = '0';
        }

    }

    ngOnDestroy(): void {
        this.unsubscribeListeners();
    }

    private unsubscribeListeners(): void {

        if (this.saveNclose$ !== undefined && this.saveNclose$ !== null) {
            this.saveNclose$.unsubscribe();
        }

        if (this.save$ !== undefined && this.save$ !== null) {
            this.save$.unsubscribe();
        }

    }

    iframeLoad(): void {

        if (this.alpdeskfeemodalframe !== null && this.alpdeskfeemodalframe !== undefined && this.alpdeskfeemodalspinner !== null && this.alpdeskfeemodalspinner !== undefined) {

            const currentURL: string = this.alpdeskfeemodalframe.nativeElement.contentWindow.location.href;
            if (this.dataRef.reloadAfterInit) {

                this.alpdeskfeemodalframe.nativeElement.contentWindow.location.reload();
                this.dataRef.reloadAfterInit = false;

                return;

            }

            this.alpdeskfeemodalframe.nativeElement.style.opacity = '1';
            this.alpdeskfeemodalspinner.nativeElement.style.display = 'none';

            const historyInvalidUrl: boolean = (currentURL.indexOf('mode=copy') > 0 || currentURL.indexOf('mode=cut') > 0);

            if (this.historyInit === currentURL) {
                this.history = [];
            }

            if (!historyInvalidUrl) {
                if (this.history.length > 0) {
                    if (this.history[this.history.length - 1] !== currentURL) {
                        this.history.push(currentURL);
                    }
                } else {
                    this.history.push(currentURL);
                    this.historyInit = currentURL;
                }
            }

            this.showBack = (this.history.length > 1);

            let validReloadResponse = true;
            if (this.saveNcloseUrl !== '') {
                validReloadResponse = (this.saveNcloseUrl !== currentURL);
            }

            this.saveNcloseUrl = currentURL;

            if (this.saveNcloseTrigger && validReloadResponse) {
                this.dialogRef.close();
            } else {

                this.saveNcloseTrigger = false;
                this.alpdeskfeemodalframe.nativeElement.style.opacity = '1';
                this.unsubscribeListeners();

                const saveNClose: HTMLElement = this.alpdeskfeemodalframe.nativeElement.contentWindow.document.getElementById('saveNclose');
                if (saveNClose !== null && saveNClose !== undefined) {
                    this.saveNclose$ = fromEvent<MouseEvent>(saveNClose, 'click').subscribe(() => {
                        this.saveNcloseTrigger = true;
                        this.alpdeskfeemodalspinner.nativeElement.style.display = 'block';
                        this.alpdeskfeemodalframe.nativeElement.style.opacity = '0';
                    });
                }

                const save: HTMLElement = this.alpdeskfeemodalframe.nativeElement.contentWindow.document.getElementById('save');
                if (save !== null && save !== undefined) {
                    this.save$ = fromEvent<MouseEvent>(save, 'click').subscribe(() => {
                        this.alpdeskfeemodalspinner.nativeElement.style.display = 'block';
                    });
                }

            }
        }
    }

    back(): void {

        if (this.alpdeskfeemodalframe !== null && this.alpdeskfeemodalframe !== undefined && this.alpdeskfeemodalspinner !== null && this.alpdeskfeemodalspinner !== undefined) {
            if (this.history.length > 0) {
                this.alpdeskfeemodalspinner.nativeElement.style.display = 'block';
                this.history.pop();
                const historyUrl = this.history.pop();
                if (historyUrl !== null && historyUrl !== undefined) {
                    this.alpdeskfeemodalframe.nativeElement.contentWindow.location.href = historyUrl;
                }

            }
        }

    }

}
