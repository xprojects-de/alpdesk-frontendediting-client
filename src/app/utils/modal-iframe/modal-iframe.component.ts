import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { fromEvent, Subscription } from 'rxjs';

export interface DialogData {
  url: string;
}

@Component({
  selector: 'app-modal-iframe',
  templateUrl: './modal-iframe.component.html',
  styleUrls: ['./modal-iframe.component.scss']
})
export class ModalIframeComponent implements OnInit, OnDestroy {

  @ViewChild('alpdeskfeemodalspinner') alpdeskfeemodalspinner!: ElementRef;
  @ViewChild('alpdeskfeemodalframe') alpdeskfeemodalframe!: ElementRef;

  private saveNcloseTrigger = false;
  private saveNclose$!: Subscription;
  private save$!: Subscription;

  url: any;
  height = 550;

  constructor(private _sanitizer: DomSanitizer, public dialogRef: MatDialogRef<ModalIframeComponent>, @Inject(MAT_DIALOG_DATA) public dataRef: DialogData) {
    //this.height = (window.innerHeight - 10);
  }

  ngOnInit() {
    this.url = this._sanitizer.bypassSecurityTrustResourceUrl(this.dataRef.url);
  }

  ngOnDestroy() {
    this.unsubscribeListeners();
  }

  private unsubscribeListeners() {
    if (this.saveNclose$ !== undefined && this.saveNclose$ !== null) {
      this.saveNclose$.unsubscribe();
    }
    if (this.save$ !== undefined && this.save$ !== null) {
      this.save$.unsubscribe();
    }
  }

  iframeLoad() {
    if (this.alpdeskfeemodalframe !== null && this.alpdeskfeemodalframe !== null && this.alpdeskfeemodalspinner !== null && this.alpdeskfeemodalspinner !== undefined) {
      this.alpdeskfeemodalspinner.nativeElement.style.display = 'none';
      if (this.saveNcloseTrigger === true) {
        this.saveNcloseTrigger = false;
        this.dialogRef.close();
      } else {

        this.unsubscribeListeners();

        let saveNClose: HTMLElement = this.alpdeskfeemodalframe.nativeElement.contentWindow.document.getElementById('saveNclose');
        if (saveNClose !== null && saveNClose !== undefined) {
          this.saveNclose$ = fromEvent<MouseEvent>(saveNClose, "click").subscribe((event: Event) => {
            this.saveNcloseTrigger = true;
            this.alpdeskfeemodalspinner.nativeElement.style.display = 'block';
            this.alpdeskfeemodalframe.nativeElement.style.opacity = '0';
          });
        }

        let save: HTMLElement = this.alpdeskfeemodalframe.nativeElement.contentWindow.document.getElementById('save');
        if (save !== null && save !== undefined) {
          this.save$ = fromEvent<MouseEvent>(save, "click").subscribe((event: Event) => {
            this.alpdeskfeemodalspinner.nativeElement.style.display = 'block';
          });
        }

      }
    }
  }

}
