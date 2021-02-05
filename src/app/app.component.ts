import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { fromEvent, Subscription } from 'rxjs';
import { Constants } from './classes/constants';
import { UrlGenerator } from './classes/url-generator';
import { ContaoClipboardCommon } from './interfaces/contao-clipboard';
import { ItemContainerComponent } from './item-container/item-container.component';
import { AlpdeskFeeServiceService } from './services/alpdesk-fee-service.service';
import { DialogData, ModalIframeComponent } from './utils/modal-iframe/modal-iframe.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  // Just for Testing - Will be as Input from Component
  @Input('base') base: string = 'https://contao.local:8890/';
  @Input('rt') rt: string = 'KkPfWF21d-xI0VzhFpZXLuRLiPFDN2s_HNpMgw-uaKo';
  @Input('frameurl') frameurl: string = '/preview.php';

  @HostListener('document:' + Constants.ALPDESK_EVENTNAME, ['$event']) onAFEE_Event(event: CustomEvent) {
    //console.log(event.detail);
    if (event.detail.preRequestGet !== null && event.detail.preRequestGet !== undefined && event.detail.preRequestGet === true) {
      let params = event.detail;
      params.preRequestGet = false;    
      this._alpdeskFeeService.callGetRequest(event.detail.url).subscribe(
        (data) => {
          //console.log(data);
          if(data.status != 200) {
            this.showSnackBar('An error has occurred');
          }
          if (params.updateBag !== undefined && params.updateBag !== null && params.updateBag === true) {
            this.updateFromContaoBag();
          }
          if (params.updateClipboard !== undefined && params.updateClipboard !== null && params.updateClipboard === true) {
            this.updateFromContaoClipboard();
          }
          if (params.snackMsg !== undefined && params.snackMsg !== null && params.snackMsg !== '') {
            this.showSnackBar(event.detail.snackMsg);
          }
          document.dispatchEvent(new CustomEvent(AlpdeskFeeServiceService.ALPDESK_EVENTNAME, {
            detail: params
          }));
        },
        (error) => {
          console.log(error);
          document.dispatchEvent(new CustomEvent(AlpdeskFeeServiceService.ALPDESK_EVENTNAME, {
            detail: params
          }));
        }
      );
    } else if (event.detail.preRequestPost !== null && event.detail.preRequestPost !== undefined && event.detail.preRequestPost === true) {
      let params = event.detail;
      params.preRequestPost = false;
      this._alpdeskFeeService.callPostRequest(event.detail.url, event.detail).subscribe(
        (data) => {
          //console.log(data);
          if (params.updateBag !== undefined && params.updateBag !== null && params.updateBag === true) {
            this.updateFromContaoBag();
          }
          if (params.updateClipboard !== undefined && params.updateClipboard !== null && params.updateClipboard === true) {
            this.updateFromContaoClipboard();
          }
          if (params.snackMsg !== undefined && params.snackMsg !== null && params.snackMsg !== '') {
            this.showSnackBar(event.detail.snackMsg);
          }
          document.dispatchEvent(new CustomEvent(AlpdeskFeeServiceService.ALPDESK_EVENTNAME, {
            detail: params
          }));
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (event.detail.action !== null && event.detail.action !== undefined && event.detail.action === 'init') {
      this.scanElements(event.detail.labels, event.detail.pageEdit, event.detail.pageId);
    } else if (event.detail.dialog !== null && event.detail.dialog !== undefined && event.detail.dialog === true) {
      this.openDialog(event.detail);
    } else if (event.detail.reloadFrame !== null && event.detail.reloadFrame !== undefined && event.detail.reloadFrame === true) {
      this.reloadIframe();
    } else if (event.detail.framelocation !== null && event.detail.framelocation !== undefined && event.detail.framelocation !== '') {
      this.iframeLocation(event.detail.framelocation);
    }
  }

  @ViewChild('alpdeskfeeframecontainer') alpdeskfeeframecontainer!: ElementRef;
  @ViewChild('alpdeskfeeframe') alpdeskfeeframe!: ElementRef;
  @ViewChild('alpdeskfeeframespinner') alpdeskfeeframespinner!: ElementRef;

  private compRef!: ComponentRef<ItemContainerComponent>;

  title = 'alpdeskfee-client';
  url: any;

  framecontainerInitHeight = 500;
  framecontainerInitHeightString = '500px';
  framecontainerDimension = '-';
  deviceselect = 'desktop';
  phone_1 = 375;
  phone_2 = 667;
  tablet_1 = 760;
  tablet_2 = 1024;

  frameUrlContent = '/preview.php';

  private subscriptions: Subscription[] = [];

  constructor(private _sanitizer: DomSanitizer, private vcRef: ViewContainerRef, private resolver: ComponentFactoryResolver, private dialog: MatDialog, private _alpdeskFeeService: AlpdeskFeeServiceService, public snackBar: MatSnackBar) {
  }

  private updateFromContaoClipboard() {
    if (this.compRef !== undefined && this.compRef !== null) {
      const data: any = {
        rt: this.rt,
        action: Constants.ACTION_CLIPBOARD,
        targetType: Constants.TARGETTYPE_INFO
      };
      this._alpdeskFeeService.callPostRequest('/contao/alpdeskfee', data).subscribe(
        (clipboard: ContaoClipboardCommon) => {
          //console.log(clipboard);
          if (clipboard !== null && clipboard !== undefined) {
            // parse tl_content clipboard
            if (clipboard.tl_content !== null && clipboard.tl_content !== undefined) {
              if (clipboard.tl_content.id !== 0) {
                if (clipboard.tl_content.mode === Constants.CLIPBOARDMODE_COPY || clipboard.tl_content.mode === Constants.CLIPBOARDMODE_CUT) {
                  this.compRef.instance.setPasteAfterId(clipboard.tl_content.id);
                  this.compRef.instance.setPasteAfterMode(clipboard.tl_content.mode);
                  if(clipboard.tl_content.alpdeskptable !== undefined && clipboard.tl_content.alpdeskptable !== null) {
                    this.compRef.instance.setPasteAfterPTable(clipboard.tl_content.alpdeskptable);
                  } else {
                    this.compRef.instance.setPasteAfterPTable(Constants.CLIPBOARDPTABLE_INVALID);
                  }
                } else {
                  this.compRef.instance.setPasteAfterId(0);
                  this.compRef.instance.setPasteAfterMode(Constants.CLIPBOARDMODE_INVALID);
                  this.compRef.instance.setPasteAfterPTable(Constants.CLIPBOARDPTABLE_INVALID);
                }
              }
              this.compRef.changeDetectorRef.detectChanges();
            }
          }

        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  private updateFromContaoBag() {
    const data: any = {
      rt: this.rt,
      action: Constants.ACTION_NEWRECORDS,
      targetType: Constants.TARGETTYPE_INFO,
      updateContentRecords: true
    };
    this._alpdeskFeeService.callPostRequest('/contao/alpdeskfee', data).subscribe(
      (bag: any) => {
        //console.log(bag);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit() {
    this.framecontainerInitHeight = (window.innerHeight - 160);
    this.framecontainerInitHeightString = this.framecontainerInitHeight + 'px';
    this.url = this._sanitizer.bypassSecurityTrustResourceUrl(this.frameurl);
    this.frameUrlContent = this.frameurl;
  }

  ngAfterViewInit() {
    this.showHideSpinner(true);
    if (this.alpdeskfeeframecontainer !== null && this.alpdeskfeeframecontainer !== undefined) {
      this.framecontainerDimension = this.alpdeskfeeframecontainer.nativeElement.offsetWidth + ' x ' + this.alpdeskfeeframecontainer.nativeElement.offsetHeight;
      const framecontainerMouseover$ = fromEvent<MouseEvent>(this.alpdeskfeeframecontainer.nativeElement, "mouseover").subscribe((event: Event) => {
        this.framecontainerDimension = this.alpdeskfeeframecontainer.nativeElement.offsetWidth + ' x ' + this.alpdeskfeeframecontainer.nativeElement.offsetHeight;
      });
      this.subscriptions.push(framecontainerMouseover$);
      const framecontainerMouseout$ = fromEvent<MouseEvent>(this.alpdeskfeeframecontainer.nativeElement, "mouseout").subscribe((event: Event) => {
        this.framecontainerDimension = this.alpdeskfeeframecontainer.nativeElement.offsetWidth + ' x ' + this.alpdeskfeeframecontainer.nativeElement.offsetHeight;
      });
      this.subscriptions.push(framecontainerMouseout$);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      if (s !== null && s !== undefined) {
        s.unsubscribe();
      }
    });
  }

  setDevice() {
    if (this.alpdeskfeeframecontainer !== null && this.alpdeskfeeframecontainer !== undefined) {
      if (this.deviceselect === 'phone') {
        this.alpdeskfeeframecontainer.nativeElement.style.width = this.phone_1 + 'px';
        this.alpdeskfeeframecontainer.nativeElement.style.height = (this.framecontainerInitHeight < this.phone_2 ? this.framecontainerInitHeight : this.phone_2) + 'px';
      } else if (this.deviceselect === 'phone_landscape') {
        this.alpdeskfeeframecontainer.nativeElement.style.height = (this.framecontainerInitHeight < this.phone_1 ? this.framecontainerInitHeight : this.phone_1) + 'px';
        this.alpdeskfeeframecontainer.nativeElement.style.width = this.phone_2 + 'px';
      } else if (this.deviceselect === 'tablet') {
        this.alpdeskfeeframecontainer.nativeElement.style.width = this.tablet_1 + 'px';
        this.alpdeskfeeframecontainer.nativeElement.style.height = (this.framecontainerInitHeight < this.tablet_2 ? this.framecontainerInitHeight : this.tablet_2) + 'px';
      } else if (this.deviceselect === 'tablet_landscape') {
        this.alpdeskfeeframecontainer.nativeElement.style.height = (this.framecontainerInitHeight < this.framecontainerInitHeight ? this.framecontainerInitHeight : this.tablet_1) + 'px';
        this.alpdeskfeeframecontainer.nativeElement.style.width = this.tablet_2 + 'px';
      } else {
        this.alpdeskfeeframecontainer.nativeElement.style.width = '100%';
        this.alpdeskfeeframecontainer.nativeElement.style.height = this.framecontainerInitHeight + 'px';
      }

      this.framecontainerDimension = this.alpdeskfeeframecontainer.nativeElement.offsetWidth + ' x ' + this.alpdeskfeeframecontainer.nativeElement.offsetHeight;

    }
  }

  openDialog(params: any) {

    const ug: UrlGenerator = new UrlGenerator()

    const url = ug.generateUrl(params, this.base, this.rt);
    const dialogData: DialogData = { url: url };

    const dialogRef = this.dialog.open(ModalIframeComponent, {
      width: '900px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadIframe();
    });
  }

  reloadIframe() {
    this.showHideSpinner(true);
    this.alpdeskfeeframe.nativeElement.contentWindow.location.reload();
  }

  reloadIframeWithCondition() {
    this.iframeLocation(this.frameUrlContent);
  }

  iframeLocation(location: string) {
    this.showHideSpinner(true);
    this.alpdeskfeeframe.nativeElement.contentWindow.location.href = location;
  }

  iframeLoad() {
    this.frameUrlContent = this.alpdeskfeeframe.nativeElement.contentWindow.location.href.replace(this.base, '/');
    this.showHideSpinner(false);
  }

  showHideSpinner(show: boolean) {
    if (this.alpdeskfeeframespinner !== null && this.alpdeskfeeframespinner !== undefined) {
      if (show) {
        this.alpdeskfeeframespinner.nativeElement.style.display = 'block';
      } else {
        this.alpdeskfeeframespinner.nativeElement.style.display = 'none';
      }
    }
  }

  showSnackBar(msg: string, durationValue: number = 4000) {
    this.snackBar.open(msg, '', { duration: durationValue });
  }

  private prepareElement(e: HTMLElement, frameContentWindow: any, event: Event) {
    let cData = frameContentWindow.document.querySelectorAll("*[data-alpdeskfee]");
    cData.forEach((eC: HTMLElement) => {
      if (eC !== e) {
        eC.style.border = 'none';
      }
    });

    // Idea to recognize all clicked elements and show any Bubble with number of items (e.g. ContenSlider, SubColumns, etc)
    //compRef.instance.pushActiveElement(e);

    let currentElement = event.target as HTMLElement;
    if (currentElement !== null && currentElement !== undefined) {
      let jsonDataElement = currentElement.getAttribute('data-alpdeskfee');
      if (jsonDataElement !== null && jsonDataElement !== undefined && jsonDataElement !== '') {
        const objElement = JSON.parse(jsonDataElement);
        if (objElement !== null && objElement !== undefined) {
          this.compRef.instance.changeElement(objElement, currentElement);
          this.compRef.changeDetectorRef.detectChanges();
          currentElement.style.outlineOffset = '4px';
          currentElement.style.border = '2px solid rgb(244, 124, 0)';
          this.updateFromContaoClipboard();
        }
      } else {
        let closestElement = currentElement.closest('*[data-alpdeskfee]') as HTMLElement;
        if (closestElement !== null && closestElement !== undefined) {
          let jsonDataElement = closestElement.getAttribute('data-alpdeskfee');
          if (jsonDataElement !== null && jsonDataElement !== undefined && jsonDataElement !== '') {
            const objElement = JSON.parse(jsonDataElement);
            if (objElement !== null && objElement !== undefined) {
              this.compRef.instance.changeElement(objElement, closestElement);
              this.compRef.changeDetectorRef.detectChanges();
              closestElement.style.outlineOffset = '4px';
              closestElement.style.border = '2px solid rgb(244, 124, 0)';
              this.updateFromContaoClipboard();
            }
          }
        }
      }
    }
  }

  scanElements(objLabels: any, pageEdit: boolean, pageId: number) {

    if (objLabels !== null && objLabels !== undefined) {

      const frameContentWindow = this.alpdeskfeeframe.nativeElement.contentWindow;
      const frameContentDocument = this.alpdeskfeeframe.nativeElement.contentDocument;

      if (frameContentWindow !== null && frameContentWindow !== undefined && frameContentDocument !== null && frameContentDocument !== undefined) {

        const compFactory = this.resolver.resolveComponentFactory(ItemContainerComponent);
        this.compRef = this.vcRef.createComponent(compFactory);
        this.compRef.instance.frameContentDocument = frameContentDocument;
        this.compRef.instance.base = this.base;
        this.compRef.instance.rt = this.rt;
        this.compRef.instance.objLabels = objLabels;
        this.compRef.instance.pageEdit = pageEdit;
        this.compRef.instance.pageId = pageId;

        frameContentDocument.body.prepend(this.compRef.location.nativeElement);

        let data = frameContentWindow.document.querySelectorAll("*[data-alpdeskfee]");
        data.forEach((e: HTMLElement) => {
          let jsonData = e.getAttribute('data-alpdeskfee');
          if (jsonData !== null && jsonData !== undefined && jsonData !== '') {
            const obj = JSON.parse(jsonData);
            if (obj !== null && obj !== undefined) {
              if (obj.type === Constants.TARGETTYPE_ARTICLE) {
                let parentNode = e.parentElement;
                if (parentNode !== null) {
                  parentNode.style.minHeight = '50px';
                  parentNode.classList.add('alpdeskfee-article-container');
                  const parentClick$ = fromEvent<MouseEvent>(parentNode, "click").subscribe((event: Event) => {
                    if (parentNode !== null) {
                      this.compRef.instance.changeParent(obj, parentNode);
                      this.compRef.changeDetectorRef.detectChanges();
                    }
                  });
                  this.subscriptions.push(parentClick$);
                }
              } else {
                e.classList.add('alpdeskfee-ce-container');
                const elementMouseover$ = fromEvent<MouseEvent>(e, "mouseover").subscribe((event: Event) => {
                  e.style.outline = '2px dashed rgb(244, 124, 0)';
                  e.style.outlineOffset = '2px';
                });
                this.subscriptions.push(elementMouseover$);
                const elementMouseout$ = fromEvent<MouseEvent>(e, "mouseout").subscribe((event: Event) => {
                  e.style.outline = '0px dashed rgb(244, 124, 0)';
                  e.style.outlineOffset = '0px';
                });
                this.subscriptions.push(elementMouseout$);
                const elementClick$ = fromEvent<MouseEvent>(e, "click").subscribe((event: Event) => {
                  this.prepareElement(e, frameContentWindow, event);
                });
                this.subscriptions.push(elementClick$);
                const elementContext$ = fromEvent<MouseEvent>(e, "contextmenu").subscribe((event: Event) => {
                  event.preventDefault();
                  this.prepareElement(e, frameContentWindow, event);
                });
                this.subscriptions.push(elementContext$);
              }
            }
          }
        });
      }
    }
  }

}
