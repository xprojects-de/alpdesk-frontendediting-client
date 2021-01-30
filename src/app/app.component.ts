import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { fromEvent, Subscription } from 'rxjs';
import { Constants } from './classes/constants';
import { UrlGenerator } from './classes/url-generator';
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
  @Input('rt') rt: string = 'oKoDxE5y71cRvpg4w29vrNqxNeqbEUQWMza_kvsmnYs';
  @Input('frameurl') frameurl: string = '/preview.php';

  @HostListener('document:' + Constants.ALPDESK_EVENTNAME, ['$event']) onAFEE_Event(event: CustomEvent) {
    //console.log(event.detail);
    if (event.detail.preRequestGet !== null && event.detail.preRequestGet !== undefined && event.detail.preRequestGet === true) {
      let params = event.detail;
      params.preRequestGet = false;
      this._alpdeskFeeService.callGetRequest(event.detail.url).subscribe(
        (data) => {
          //console.log(data);
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

  constructor(private _sanitizer: DomSanitizer, private vcRef: ViewContainerRef, private resolver: ComponentFactoryResolver, private dialog: MatDialog, private _alpdeskFeeService: AlpdeskFeeServiceService) {
  }

  ngOnInit() {
    this.framecontainerInitHeight = (window.innerHeight - 210);
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
    if(this.alpdeskfeeframespinner !== null && this.alpdeskfeeframespinner !== undefined) {
      if(show) {
        this.alpdeskfeeframespinner.nativeElement.style.display = 'block';
      } else {
        this.alpdeskfeeframespinner.nativeElement.style.display = 'none';
      }
    }
  }

  private prepareElement(e: HTMLElement, frameContentWindow: any, compRef: ComponentRef<ItemContainerComponent>, event: Event) {
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
          compRef.instance.changeElement(objElement, currentElement);
          compRef.changeDetectorRef.detectChanges();
          currentElement.style.outlineOffset = '4px';
          currentElement.style.border = '2px solid rgb(244, 124, 0)';
        }
      } else {
        let closestElement = currentElement.closest('*[data-alpdeskfee]') as HTMLElement;
        if (closestElement !== null && closestElement !== undefined) {
          let jsonDataElement = closestElement.getAttribute('data-alpdeskfee');
          if (jsonDataElement !== null && jsonDataElement !== undefined && jsonDataElement !== '') {
            const objElement = JSON.parse(jsonDataElement);
            if (objElement !== null && objElement !== undefined) {
              compRef.instance.changeElement(objElement, closestElement);
              compRef.changeDetectorRef.detectChanges();
              closestElement.style.outlineOffset = '4px';
              closestElement.style.border = '2px solid rgb(244, 124, 0)';
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
        const compRef: ComponentRef<ItemContainerComponent> = this.vcRef.createComponent(compFactory);
        compRef.instance.frameContentDocument = frameContentDocument;
        compRef.instance.base = this.base;
        compRef.instance.rt = this.rt;
        compRef.instance.objLabels = objLabels;
        compRef.instance.pageEdit = pageEdit;
        compRef.instance.pageId = pageId;

        frameContentDocument.body.prepend(compRef.location.nativeElement);

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
                      compRef.instance.changeParent(obj, parentNode);
                      compRef.changeDetectorRef.detectChanges();
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
                  this.prepareElement(e, frameContentWindow, compRef, event);
                });
                this.subscriptions.push(elementClick$);
                const elementContext$ = fromEvent<MouseEvent>(e, "contextmenu").subscribe((event: Event) => {
                  event.preventDefault();
                  this.prepareElement(e, frameContentWindow, compRef, event);
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
