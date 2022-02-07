import {AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ElementPosition} from '../interfaces/element-position';

@Directive({
    selector: '[appItemBar]'
})
export class ItemBarDirective implements AfterViewInit, OnDestroy {

    @Input() frameContentDocument!: HTMLDocument;
    @Input() selectedElement!: HTMLElement;
    @Input() offsetTop = '0px';

    @Output() directiveChangePosition = new EventEmitter<ElementPosition>();

    private readonly element: HTMLElement;
    private sticky = false;

    private subscriptions: Subscription[] = [];
    private frameScrollSubscription!: Subscription;

    constructor(el: ElementRef) {
        this.element = el.nativeElement;
    }

    ngAfterViewInit(): void {

        this.stickyItemBar();
        this.draggableElement();

    }

    ngOnDestroy(): void {

        this.subscriptions.forEach((s) => {
            if (s !== null && s !== undefined) {
                s.unsubscribe();
            }
        });

        if (this.frameScrollSubscription !== null && this.frameScrollSubscription !== undefined) {
            this.frameScrollSubscription.unsubscribe();
        }

    }

    private positionStickyElement(): void {

        if (this.selectedElement !== undefined && this.selectedElement !== null && this.element !== undefined && this.element !== null) {

            const topSelected = this.selectedElement.getBoundingClientRect().top - this.element.offsetHeight;
            const bottomBorder = this.selectedElement.getBoundingClientRect().bottom;

            if (bottomBorder <= 0) {

                this.element.style.position = 'absolute';
                this.element.style.top = this.offsetTop;
                this.sticky = false;
                this.directiveChangePosition.emit({top: this.offsetTop, position: 'absolute'});

            } else {

                if (topSelected <= 0 && !this.sticky) {
                    this.element.style.position = 'fixed';
                    this.element.style.top = '0px';
                    this.sticky = true;
                    this.directiveChangePosition.emit({top: '0px', position: 'fixed'});
                } else if (topSelected > 0 && this.sticky) {
                    this.element.style.position = 'absolute';
                    this.element.style.top = this.offsetTop;
                    this.sticky = false;
                    this.directiveChangePosition.emit({top: this.offsetTop, position: 'absolute'});
                }

            }

        }

    }

    stickyItemBar(): void {

        const frameScrollEvent$ = fromEvent<MouseEvent>(this.frameContentDocument, 'scroll');
        this.frameScrollSubscription = frameScrollEvent$.subscribe(() => {

            if (this.frameContentDocument !== undefined && this.frameContentDocument !== null) {
                this.positionStickyElement();
            }

        });

    }

    // tslint:disable-next-line:typedef
    private getTransformMatrix(value: string) {

        if (value !== null && value !== undefined && value !== '') {

            const values = value.split(/\w+\(|\);?/);
            // tslint:disable-next-line:radix
            const transform = values[1].split(/,\s?/g).map((numStr: string) => parseInt(numStr));

            return {x: transform[0], y: transform[1], z: transform[2]};

        }

        return {x: 0, y: 0, z: 0};
    }


    draggableElement(): void {

        const moveItem = this.element.querySelector('app-item-move') as HTMLElement;

        if (moveItem !== null && moveItem !== undefined) {

            const dragStart$ = fromEvent<MouseEvent>(moveItem, 'mousedown');
            const dragEnd$ = fromEvent<MouseEvent>(this.frameContentDocument, 'mouseup');
            const drag$ = fromEvent<MouseEvent>(this.frameContentDocument, 'mousemove').pipe(takeUntil(dragEnd$));

            // tslint:disable-next-line:one-variable-per-declaration
            let initialX: number, initialY: number, currentX = 0, currentY = 0;
            let dragSub!: Subscription;

            const dragStartSub = dragStart$.subscribe((event: MouseEvent) => {

                const transformMatrix = this.getTransformMatrix(this.element.style.transform);
                if (transformMatrix.x === 0) {
                    currentX = 0;
                }
                if (transformMatrix.y === 0) {
                    currentY = 0;
                }

                initialX = event.clientX - currentX;
                initialY = event.clientY - currentY;

                // tslint:disable-next-line:no-shadowed-variable
                dragSub = drag$.subscribe((event: MouseEvent) => {
                    event.preventDefault();
                    currentX = event.clientX - initialX;
                    currentY = event.clientY - initialY;
                    this.element.style.transform = 'translate3d(' + currentX + 'px, ' + currentY + 'px, 0)';
                });
            });

            const dragEndSub = dragEnd$.subscribe(() => {
                initialX = currentX;
                initialY = currentY;
                if (dragSub) {
                    dragSub.unsubscribe();
                }
            });

            this.subscriptions.push.apply(this.subscriptions, [dragStartSub, dragSub, dragEndSub]);
        }
    }
}
