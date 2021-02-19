import { Component, ElementRef, ViewChild } from '@angular/core';
import { Constants } from '../classes/constants';
import { ElementPosition } from '../interfaces/element-position';

@Component({
  selector: 'app-item-container',
  templateUrl: './item-container.component.html',
  styleUrls: ['./item-container.component.scss']
})
export class ItemContainerComponent {

  @ViewChild('articleContainer') articleContainer!: ElementRef;
  @ViewChild('elementContainer') elementContainer!: ElementRef;
  @ViewChild('modContainer') modContainer!: ElementRef;

  frameContentDocument!: HTMLDocument;

  currentHeight = 35;

  base: string = '';
  rt: string = '';

  objLabels: any;
  pageEdit: boolean = false;
  pageId: number = 0;
  accessFilemanagement: boolean = false;

  elementParent!: HTMLElement;
  jsonDataParent: any;
  positionParent: string = 'absolute';
  offsetOriginalTopParent: string = '0px';
  offsetTopParent: string = '0px';
  transformParent: string = 'translate3d(0, 0, 0)';

  elementElement!: HTMLElement;
  jsonDataElement: any;
  positionElement: string = 'absolute';
  offsetOriginalTopElement: string = '0px';
  offsetTopElement: string = '0px';
  offsetLeftElement: string = '0px';
  transformElement: string = 'translate3d(0, 0, 0)';

  activeElements: HTMLElement[] = [];

  TARGETTYPE_PAGE = Constants.TARGETTYPE_PAGE;
  TARGETTYPE_ARTICLE = Constants.TARGETTYPE_ARTICLE;
  TARGETTYPE_FILEMANAGEMENT = Constants.TARGETTYPE_FILEMANAGEMENT;
  TARGETTYPE_CE = Constants.TARGETTYPE_CE;
  TARGETTYPE_MOD = Constants.TARGETTYPE_MOD;

  ACTION_PARENT_EDIT = Constants.ACTION_PARENT_EDIT;
  ACTION_ELEMENT_EDIT = Constants.ACTION_ELEMENT_EDIT;
  ACTION_ELEMENT_VISIBILITY = Constants.ACTION_ELEMENT_VISIBILITY;
  ACTION_ELEMENT_DELETE = Constants.ACTION_ELEMENT_DELETE;
  ACTION_ELEMENT_SHOW = Constants.ACTION_ELEMENT_SHOW;
  ACTION_ELEMENT_NEW = Constants.ACTION_ELEMENT_NEW;
  ACTION_ELEMENT_COPY = Constants.ACTION_ELEMENT_COPY;
  ACTION_ELEMENT_CUT = Constants.ACTION_ELEMENT_CUT;
  ACTION_ELEMENT_DRAG = Constants.ACTION_ELEMENT_DRAG;
  ACTION_ELEMENT_PASTEAFTER = Constants.ACTION_ELEMENT_PASTEAFTER;
  CLIPBOARDMODE_PASTETARGET_CE = Constants.CLIPBOARDMODE_PASTETARGET_CE;
  CLIPBOARDMODE_PASTETARGET_ARTICLE = Constants.CLIPBOARDMODE_PASTETARGET_ARTICLE;

  pasteAfterId = 0;
  pasteAfterMode = '';
  pasteAfterPtable = Constants.CLIPBOARDPTABLE_INVALID;

  constructor() { }

  changeParent(jsonData: any, element: HTMLElement): void {
    this.jsonDataParent = jsonData;
    this.elementParent = element;
    if (this.elementParent !== null) {
      let top = element.getBoundingClientRect().top - this.currentHeight;
      this.offsetOriginalTopParent = (top + this.frameContentDocument.documentElement.scrollTop) + 'px';
      if (top <= 0) {
        this.positionParent = 'fixed';
        this.offsetTopParent = '0px';
      } else {
        this.positionParent = 'absolute';
        this.offsetTopParent = this.offsetOriginalTopParent;
      }
      if (this.articleContainer !== null && this.articleContainer !== undefined) {
        this.articleContainer.nativeElement.style.transform = this.transformParent;
        // Bug Safari
        this.articleContainer.nativeElement.style.position = this.positionParent;
      }
    } else {
      this.positionParent = 'absolute';
      this.offsetTopParent = '0px';
      if (this.articleContainer !== null && this.articleContainer !== undefined) {
        this.articleContainer.nativeElement.style.transform = this.transformParent;
        // Bug Safari
        this.articleContainer.nativeElement.style.position = this.positionParent;
      }
    }
  }

  changeElement(jsonData: any, element: HTMLElement): void {
    this.jsonDataElement = jsonData;
    this.elementElement = element;
    if (this.elementElement !== null) {
      let top = element.getBoundingClientRect().top - this.currentHeight;
      this.offsetOriginalTopElement = (top + this.frameContentDocument.documentElement.scrollTop) + 'px';
      if (top <= 0) {
        this.positionElement = 'fixed';
        this.offsetTopElement = '0px';
      } else {
        this.positionElement = 'absolute';
        this.offsetTopElement = this.offsetOriginalTopElement;
      }
      this.offsetLeftElement = element.getBoundingClientRect().left + 'px';
      if (this.elementContainer !== null && this.elementContainer !== undefined) {
        this.elementContainer.nativeElement.style.transform = this.transformElement;
        // Bug Safari
        this.elementContainer.nativeElement.style.position = this.positionElement;
      }
      if (this.modContainer !== null && this.modContainer !== undefined) {
        this.modContainer.nativeElement.style.transform = this.transformElement;
        this.modContainer.nativeElement.style.position = this.positionElement;
      }
    } else {
      this.positionElement = 'absolute';
      this.offsetTopElement = '0px';
      this.offsetLeftElement = '0px';
      if (this.elementContainer !== null && this.elementContainer !== undefined) {
        this.elementContainer.nativeElement.style.transform = this.transformElement;
        this.elementContainer.nativeElement.style.position = this.positionElement;
      }
      if (this.modContainer !== null && this.modContainer !== undefined) {
        this.modContainer.nativeElement.style.transform = this.transformElement;
        this.modContainer.nativeElement.style.position = this.positionElement;
      }
    }
  }

  directiveChangePositionParent(event: ElementPosition) {
    //this.positionParent = event.position;
    //this.offsetTopParent = event.top;
  }

  directiveChangePositionElement(event: ElementPosition) {
    //this.positionElement = event.position;
    //this.offsetTopElement = event.top;
  }

  setPasteAfterId(value: number) {
    this.pasteAfterId = value;
  }

  setPasteAfterMode(value: string) {
    this.pasteAfterMode = value;
  }

  setPasteAfterPTable(value: string) {
    this.pasteAfterPtable = value;
  }

  clearActiveElements() {
    this.activeElements = [];
  }

  pushActiveElement(element: HTMLElement) {
    this.activeElements.push(element);
  }

}
