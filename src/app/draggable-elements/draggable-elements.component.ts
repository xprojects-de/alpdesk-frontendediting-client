import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';

@Component({
    selector: 'app-draggable-elements',
    templateUrl: './draggable-elements.component.html',
    styleUrls: ['./draggable-elements.component.scss']
})
export class DraggableElementsComponent implements AfterViewInit, OnDestroy {

    @ViewChild('draggableElement') draggableElement!: ElementRef;
    private subscriptions: Subscription[] = [];

    constructor() {
    }

    ngAfterViewInit(): void {
        this.draggable();
    }

    ngOnDestroy(): void {

        this.subscriptions.forEach((s) => {
            if (s !== null && s !== undefined) {
                s.unsubscribe();
            }
        });

    }

    draggable(): void {

        if (this.draggableElement.nativeElement !== null && this.draggableElement.nativeElement !== undefined) {

            this.draggableElement.nativeElement.draggable = true;

            const dragStart$ = fromEvent<DragEvent>(this.draggableElement.nativeElement, 'dragstart').subscribe((event: DragEvent) => {
                if (event !== null && event !== undefined) {
                    console.log('Drag Start');
                    // @ts-ignore
                    event.dataTransfer.setData('type', 'text');
                }
            });

            this.subscriptions.push.apply(this.subscriptions, [dragStart$]);
        }
    }

}
