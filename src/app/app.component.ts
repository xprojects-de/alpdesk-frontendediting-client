import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    ElementRef,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {DialogPosition, MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DomSanitizer} from '@angular/platform-browser';
import {fromEvent, Subscription} from 'rxjs';
import {Constants} from './classes/constants';
import {UrlGenerator} from './classes/url-generator';
import {ContaoClipboardCommon} from './interfaces/contao-clipboard';
import {ItemContainerComponent} from './item-container/item-container.component';
import {AlpdeskFeeServiceService} from './services/alpdesk-fee-service.service';
import {DialogData, ModalIframeComponent} from './utils/modal-iframe/modal-iframe.component';
import {DraggableElementsComponent} from './draggable-elements/draggable-elements.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

    // tslint:disable-next-line:max-line-length variable-name
    constructor(private _sanitizer: DomSanitizer, private vcRef: ViewContainerRef, private resolver: ComponentFactoryResolver, private dialog: MatDialog, private _alpdeskFeeService: AlpdeskFeeServiceService, public snackBar: MatSnackBar) {
    }

    // Just for Testing - Will be as Input from Component
    // tslint:disable-next-line:no-input-rename
    @Input('base') base = 'https://contao.local:8890/';
    // tslint:disable-next-line:no-input-rename
    @Input('rt') rt = 'P-04hv8i5HPaJL0uk4e2Kw7P8eMGHWTLaVr9Ka1i390';
    // tslint:disable-next-line:no-input-rename
    @Input('frameurl') frameurl = '/preview.php';
    // tslint:disable-next-line:no-input-rename
    @Input('elements') elements = '{"Text-Elemente":[{"key":"headline","label":"\u00dcberschrift"},{"key":"text","label":"Text"},{"key":"html","label":"HTML"},{"key":"list","label":"Aufz\u00e4hlung"},{"key":"table","label":"Tabelle"},{"key":"code","label":"Code"},{"key":"markdown","label":"Markdown"}],"Akkordeon":[{"key":"accordionSingle","label":"Einzelelement"},{"key":"accordionStart","label":"Umschlag Anfang"},{"key":"accordionStop","label":"Umschlag Ende"}],"Content-Slider":[{"key":"sliderStart","label":"Umschlag Anfang"},{"key":"sliderStop","label":"Umschlag Ende"}],"Link-Elemente":[{"key":"hyperlink","label":"Hyperlink"},{"key":"toplink","label":"Top-Link"}],"Media-Elemente":[{"key":"image","label":"Bild"},{"key":"gallery","label":"Galerie"},{"key":"player","label":"Video\\/Audio"},{"key":"youtube","label":"YouTube"},{"key":"vimeo","label":"Vimeo"}],"Datei-Elemente":[{"key":"download","label":"Download"},{"key":"downloads","label":"Downloads"}],"Include-Elemente":[{"key":"article","label":"Artikel"},{"key":"alias","label":"Inhaltselement"},{"key":"form","label":"Formular"},{"key":"module","label":"Modul"},{"key":"teaser","label":"Artikelteaser"},{"key":"xproject_team","label":"xproject_team"},{"key":"xprojects_overview","label":"xprojects_overview"},{"key":"xprojects_detail","label":"xprojects_detail"},{"key":"rocksolid_slider","label":"rocksolid_slider"}],"Spaltenset":[{"key":"colsetStart","label":"Spaltenset Start"},{"key":"colsetPart","label":"Spaltenset Trennelemente"},{"key":"colsetEnd","label":"Spaltenset Endelement"}]}';

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
    // tslint:disable-next-line:variable-name
    phone_1 = 375;
    // tslint:disable-next-line:variable-name
    phone_2 = 667;
    // tslint:disable-next-line:variable-name
    tablet_1 = 760;
    // tslint:disable-next-line:variable-name
    tablet_2 = 1024;

    frameUrlContent = '/preview.php';

    private subscriptions: Subscription[] = [];
    private elementsDialogOpened = false;

    // tslint:disable-next-line:typedef
    @HostListener('document:' + Constants.ALPDESK_EVENTNAME, ['$event']) onAFEE_Event(event: CustomEvent) {

        // console.log(event.detail);

        if (event.detail.preRequestGet !== null && event.detail.preRequestGet !== undefined && event.detail.preRequestGet === true) {

            const params = event.detail;
            params.preRequestGet = false;

            this._alpdeskFeeService.callGetRequest(event.detail.url).subscribe(
                (data) => {

                    // console.log(data);
                    if (data.status !== 200) {
                        this.showSnackBar('An error has occurred');
                    }

                    if (params.snackMsg !== undefined && params.snackMsg !== null && params.snackMsg !== '') {
                        this.showSnackBar(event.detail.snackMsg);
                    }

                    if (params.updateBag !== undefined && params.updateBag !== null && params.updateBag === true) {
                        this.updateFromContaoBag(params);
                    } else {
                        document.dispatchEvent(new CustomEvent(AlpdeskFeeServiceService.ALPDESK_EVENTNAME, {
                            detail: params
                        }));
                    }

                },
                (error) => {
                    console.log(error);
                    document.dispatchEvent(new CustomEvent(AlpdeskFeeServiceService.ALPDESK_EVENTNAME, {
                        detail: params
                    }));
                }
            );

            // tslint:disable-next-line:max-line-length
        } else if (event.detail.preRequestPost !== null && event.detail.preRequestPost !== undefined && event.detail.preRequestPost === true) {

            const params = event.detail;
            params.preRequestPost = false;

            this._alpdeskFeeService.callPostRequest(event.detail.url, event.detail).subscribe(
                (data) => {

                    // console.log(data);
                    if (params.snackMsg !== undefined && params.snackMsg !== null && params.snackMsg !== '') {
                        this.showSnackBar(event.detail.snackMsg);
                    }

                    if (params.updateClipboard !== undefined && params.updateClipboard !== null && params.updateClipboard === true) {
                        this.updateFromContaoClipboard();
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
            this.scanElements(event.detail.labels, event.detail.pageEdit, event.detail.pageId, event.detail.accessFilemanagement);
        } else if (event.detail.dialog !== null && event.detail.dialog !== undefined && event.detail.dialog === true) {
            this.openDialog(event.detail);
        } else if (event.detail.reloadFrame !== null && event.detail.reloadFrame !== undefined && event.detail.reloadFrame === true) {
            this.reloadIframe();
        } else if (event.detail.framelocation !== null && event.detail.framelocation !== undefined && event.detail.framelocation !== '') {
            this.iframeLocation(event.detail.framelocation);
        }
    }

    private updateFromContaoClipboard(): void {

        if (this.compRef !== undefined && this.compRef !== null) {

            const data: any = {
                rt: this.rt,
                action: Constants.ACTION_CLIPBOARD,
                targetType: Constants.TARGETTYPE_INFO
            };
            this._alpdeskFeeService.callPostRequest('/contao/alpdeskfee', data).subscribe(
                (clipboard: ContaoClipboardCommon) => {

                    // console.log(clipboard);
                    if (clipboard !== null && clipboard !== undefined) {
                        // parse tl_content clipboard
                        if (clipboard.tl_content !== null && clipboard.tl_content !== undefined) {
                            if (clipboard.tl_content.id !== 0) {

                                // tslint:disable-next-line:max-line-length
                                if (clipboard.tl_content.mode === Constants.CLIPBOARDMODE_COPY || clipboard.tl_content.mode === Constants.CLIPBOARDMODE_CUT) {
                                    this.compRef.instance.setPasteAfterId(clipboard.tl_content.id);
                                    this.compRef.instance.setPasteAfterMode(clipboard.tl_content.mode);
                                    if (clipboard.tl_content.alpdeskptable !== undefined && clipboard.tl_content.alpdeskptable !== null) {
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

    private updateFromContaoBag(params: any): void {

        const data: any = {
            rt: this.rt,
            action: Constants.ACTION_NEWRECORDS,
            targetType: Constants.TARGETTYPE_INFO,
            updateContentRecords: true
        };

        this._alpdeskFeeService.callPostRequest('/contao/alpdeskfee', data).subscribe(
            (bag: any) => {

                // console.log(bag);
                document.dispatchEvent(new CustomEvent(AlpdeskFeeServiceService.ALPDESK_EVENTNAME, {
                    detail: params
                }));

            },
            (error) => {
                console.log(error);
                this.showSnackBar('An error has occurred');
            }
        );

    }

    ngOnInit(): void {

        this.framecontainerInitHeight = (window.innerHeight - 160);
        this.framecontainerInitHeightString = this.framecontainerInitHeight + 'px';
        this.url = this._sanitizer.bypassSecurityTrustResourceUrl(this.frameurl);
        this.frameUrlContent = this.frameurl;

    }

    ngAfterViewInit(): void {

        this.showHideSpinner(true);

        if (this.alpdeskfeeframecontainer !== null && this.alpdeskfeeframecontainer !== undefined) {

            // tslint:disable-next-line:max-line-length
            this.framecontainerDimension = this.alpdeskfeeframecontainer.nativeElement.offsetWidth + ' x ' + this.alpdeskfeeframecontainer.nativeElement.offsetHeight;
            // tslint:disable-next-line:max-line-length
            const framecontainerMouseover$ = fromEvent<MouseEvent>(this.alpdeskfeeframecontainer.nativeElement, 'mouseover').subscribe((event: Event) => {
                // tslint:disable-next-line:max-line-length
                this.framecontainerDimension = this.alpdeskfeeframecontainer.nativeElement.offsetWidth + ' x ' + this.alpdeskfeeframecontainer.nativeElement.offsetHeight;
            });

            this.subscriptions.push(framecontainerMouseover$);
            // tslint:disable-next-line:max-line-length
            const framecontainerMouseout$ = fromEvent<MouseEvent>(this.alpdeskfeeframecontainer.nativeElement, 'mouseout').subscribe((event: Event) => {
                // tslint:disable-next-line:max-line-length
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

    setDevice(): void {

        if (this.alpdeskfeeframecontainer !== null && this.alpdeskfeeframecontainer !== undefined) {

            if (this.deviceselect === 'phone') {

                this.alpdeskfeeframecontainer.nativeElement.style.width = this.phone_1 + 'px';
                // tslint:disable-next-line:max-line-length
                this.alpdeskfeeframecontainer.nativeElement.style.height = (this.framecontainerInitHeight < this.phone_2 ? this.framecontainerInitHeight : this.phone_2) + 'px';

            } else if (this.deviceselect === 'phone_landscape') {

                // tslint:disable-next-line:max-line-length
                this.alpdeskfeeframecontainer.nativeElement.style.height = (this.framecontainerInitHeight < this.phone_1 ? this.framecontainerInitHeight : this.phone_1) + 'px';
                this.alpdeskfeeframecontainer.nativeElement.style.width = this.phone_2 + 'px';

            } else if (this.deviceselect === 'tablet') {

                this.alpdeskfeeframecontainer.nativeElement.style.width = this.tablet_1 + 'px';
                // tslint:disable-next-line:max-line-length
                this.alpdeskfeeframecontainer.nativeElement.style.height = (this.framecontainerInitHeight < this.tablet_2 ? this.framecontainerInitHeight : this.tablet_2) + 'px';

            } else if (this.deviceselect === 'tablet_landscape') {

                // tslint:disable-next-line:max-line-length
                this.alpdeskfeeframecontainer.nativeElement.style.height = (this.framecontainerInitHeight < this.framecontainerInitHeight ? this.framecontainerInitHeight : this.tablet_1) + 'px';
                this.alpdeskfeeframecontainer.nativeElement.style.width = this.tablet_2 + 'px';

            } else {

                this.alpdeskfeeframecontainer.nativeElement.style.width = '100%';
                this.alpdeskfeeframecontainer.nativeElement.style.height = this.framecontainerInitHeight + 'px';

            }

            // tslint:disable-next-line:max-line-length
            this.framecontainerDimension = this.alpdeskfeeframecontainer.nativeElement.offsetWidth + ' x ' + this.alpdeskfeeframecontainer.nativeElement.offsetHeight;

        }
    }

    openDialog(params: any): void {

        const ug: UrlGenerator = new UrlGenerator();

        const url = ug.generateUrl(params, this.base, this.rt);

        let reloadAfterInit = false;
        if (params.reloadAfterInit !== null && params.reloadAfterInit !== undefined && params.reloadAfterInit) {
            reloadAfterInit = true;
        }

        const dialogData: DialogData = {url, reloadAfterInit};

        const dialogRef = this.dialog.open(ModalIframeComponent, {
            width: '80vw',
            height: '85vh',
            data: dialogData
        });

        dialogRef.afterClosed().subscribe(result => {
            this.reloadIframe();
        });
    }

    openDialogElements(): void {

        if (this.elementsDialogOpened === false) {

            const dialogPosition: DialogPosition = {
                top: '0px',
                left: '0px'
            };

            const dialogRef = this.dialog.open(DraggableElementsComponent, {
                width: '250px',
                height: '100vh',
                hasBackdrop: false,
                position: dialogPosition,
                panelClass: 'elementsDialog',
                data: this.elements
            });

            this.elementsDialogOpened = true;

            dialogRef.afterClosed().subscribe(result => {
                this.elementsDialogOpened = false;
            });

        }
    }

    reloadIframe(): void {

        this.showHideSpinner(true);
        this.alpdeskfeeframe.nativeElement.contentWindow.location.reload();

    }

    reloadIframeWithCondition(): void {
        this.iframeLocation(this.frameUrlContent);
    }

    iframeLocation(location: string): void {

        this.showHideSpinner(true);
        this.alpdeskfeeframe.nativeElement.contentWindow.location.href = location;

    }

    iframeLoad(): void {

        this.frameUrlContent = this.alpdeskfeeframe.nativeElement.contentWindow.location.href.replace(this.base, '/');
        this.showHideSpinner(false);

    }

    showHideSpinner(show: boolean): void {

        if (this.alpdeskfeeframespinner !== null && this.alpdeskfeeframespinner !== undefined) {
            if (show) {
                this.alpdeskfeeframespinner.nativeElement.style.display = 'block';
            } else {
                this.alpdeskfeeframespinner.nativeElement.style.display = 'none';
            }
        }

    }

    showSnackBar(msg: string, durationValue: number = 4000): void {
        this.snackBar.open(msg, '', {duration: durationValue});
    }

    private prepareElement(e: HTMLElement, frameContentWindow: any, event: Event): void {

        const cData = frameContentWindow.document.querySelectorAll('*[data-alpdeskfee]');
        cData.forEach((eC: HTMLElement) => {
            if (eC !== e) {
                eC.style.border = 'none';
            }
        });

        // Idea to recognize all clicked elements and show any Bubble with number of items (e.g. ContenSlider, SubColumns, etc)
        // compRef.instance.pushActiveElement(e);

        const currentElement = event.target as HTMLElement;
        if (currentElement !== null && currentElement !== undefined) {

            const jsonDataElement = currentElement.getAttribute('data-alpdeskfee');
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

                const closestElement = currentElement.closest('*[data-alpdeskfee]') as HTMLElement;
                if (closestElement !== null && closestElement !== undefined) {
                    // tslint:disable-next-line:no-shadowed-variable
                    const jsonDataElement = closestElement.getAttribute('data-alpdeskfee');
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

    scanElements(objLabels: any, pageEdit: boolean, pageId: number, accessFilemanagement: boolean): void {

        if (objLabels !== null && objLabels !== undefined) {

            const frameContentWindow = this.alpdeskfeeframe.nativeElement.contentWindow;
            const frameContentDocument = this.alpdeskfeeframe.nativeElement.contentDocument;

            // tslint:disable-next-line:max-line-length
            if (frameContentWindow !== null && frameContentWindow !== undefined && frameContentDocument !== null && frameContentDocument !== undefined) {

                const compFactory = this.resolver.resolveComponentFactory(ItemContainerComponent);
                this.compRef = this.vcRef.createComponent(compFactory);
                this.compRef.instance.frameContentDocument = frameContentDocument;
                this.compRef.instance.base = this.base;
                this.compRef.instance.rt = this.rt;
                this.compRef.instance.objLabels = objLabels;
                this.compRef.instance.pageEdit = pageEdit;
                this.compRef.instance.pageId = pageId;
                this.compRef.instance.accessFilemanagement = accessFilemanagement;

                frameContentDocument.body.prepend(this.compRef.location.nativeElement);

                const data = frameContentWindow.document.querySelectorAll('*[data-alpdeskfee]');
                data.forEach((e: HTMLElement) => {

                    const jsonData = e.getAttribute('data-alpdeskfee');

                    if (jsonData !== null && jsonData !== undefined && jsonData !== '') {

                        const obj = JSON.parse(jsonData);
                        if (obj !== null && obj !== undefined) {

                            if (obj.type === Constants.TARGETTYPE_ARTICLE) {

                                const parentNode = e.parentElement;
                                if (parentNode !== null) {

                                    parentNode.style.minHeight = '50px';
                                    parentNode.classList.add('alpdeskfee-article-container');
                                    const parentClick$ = fromEvent<MouseEvent>(parentNode, 'click').subscribe((event: Event) => {
                                        if (parentNode !== null) {
                                            this.compRef.instance.changeParent(obj, parentNode);
                                            this.compRef.changeDetectorRef.detectChanges();
                                        }
                                    });
                                    this.subscriptions.push(parentClick$);

                                }

                            } else {

                                e.classList.add('alpdeskfee-ce-container');
                                const elementMouseover$ = fromEvent<MouseEvent>(e, 'mouseover').subscribe((event: Event) => {
                                    e.style.outline = '2px dashed rgb(244, 124, 0)';
                                    e.style.outlineOffset = '2px';
                                });
                                this.subscriptions.push(elementMouseover$);

                                const elementMouseout$ = fromEvent<MouseEvent>(e, 'mouseout').subscribe((event: Event) => {
                                    e.style.outline = '0px dashed rgb(244, 124, 0)';
                                    e.style.outlineOffset = '0px';
                                });
                                this.subscriptions.push(elementMouseout$);

                                const elementClick$ = fromEvent<MouseEvent>(e, 'click').subscribe((event: Event) => {
                                    this.prepareElement(e, frameContentWindow, event);
                                });
                                this.subscriptions.push(elementClick$);

                                const elementContext$ = fromEvent<MouseEvent>(e, 'contextmenu').subscribe((event: Event) => {
                                    event.preventDefault();
                                    this.prepareElement(e, frameContentWindow, event);
                                });
                                this.subscriptions.push(elementContext$);

                                if (obj.type === Constants.TARGETTYPE_CE) {

                                    const dragEnter$ = fromEvent<DragEvent>(e, 'dragenter').subscribe((event: DragEvent) => {
                                        event.preventDefault();
                                    });
                                    this.subscriptions.push(dragEnter$);

                                    const dragLeave$ = fromEvent<DragEvent>(e, 'dragleave').subscribe((event: DragEvent) => {
                                        event.preventDefault();
                                        e.style.borderBottom = 'none';
                                    });
                                    this.subscriptions.push(dragLeave$);

                                    const dragOver$ = fromEvent<DragEvent>(e, 'dragover').subscribe((event: DragEvent) => {
                                        event.preventDefault();
                                        e.style.borderBottom = '5px solid rgb(244, 124, 0)';
                                    });
                                    this.subscriptions.push(dragOver$);

                                    const drop$ = fromEvent<DragEvent>(e, 'drop').subscribe((event: DragEvent) => {

                                        event.preventDefault();
                                        event.stopPropagation();

                                        // tslint:disable-next-line:max-line-length
                                        if (event !== null && event !== undefined && event.dataTransfer !== null && event.dataTransfer !== undefined) {

                                            const eventData = event.dataTransfer.getData('type');
                                            document.dispatchEvent(new CustomEvent(AlpdeskFeeServiceService.ALPDESK_EVENTNAME, {
                                                detail: {
                                                    preRequestPost: true,
                                                    rt: this.rt,
                                                    url: '/contao/alpdeskfee',
                                                    dialog: true,
                                                    action: Constants.ACTION_ELEMENT_NEW,
                                                    targetType: Constants.TARGETTYPE_CE,
                                                    do: obj.do,
                                                    id: obj.id,
                                                    pid: obj.pid,
                                                    pageEdit: obj.pageEdit,
                                                    pageId: obj.pageId,
                                                    element_type: eventData,
                                                    reloadAfterInit: true
                                                }
                                            }));
                                        }
                                    });

                                    this.subscriptions.push(drop$);

                                }

                            }

                        }

                    }

                });
            }
        }
    }

}
