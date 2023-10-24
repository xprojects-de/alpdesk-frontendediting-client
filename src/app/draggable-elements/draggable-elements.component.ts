import {Component, Inject, OnInit} from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';

export interface DraggableElements {
    key: string;
    label: string;
}

export interface DraggableElementsGroup {
    label: string;
    items: DraggableElements[];
}

@Component({
    selector: 'app-draggable-elements',
    templateUrl: './draggable-elements.component.html',
    styleUrls: ['./draggable-elements.component.scss']
})
export class DraggableElementsComponent implements OnInit {

    draggableElements: DraggableElementsGroup[] = [];

    constructor(public dialogRef: MatDialogRef<DraggableElementsComponent>, @Inject(MAT_DIALOG_DATA) public dataRef: string) {
    }

    ngOnInit(): void {

        if (this.dataRef !== null && this.dataRef !== undefined && this.dataRef !== '') {

            const validElements = JSON.parse(this.dataRef);
            if (validElements !== null && validElements !== undefined) {

                const tmpDraggableElements: DraggableElementsGroup[] = [];

                Object.keys(validElements).forEach(key => {

                    const tmpGroup: DraggableElementsGroup = {
                        label: key as string,
                        items: validElements[key] as DraggableElements[]
                    };
                    tmpDraggableElements.push(tmpGroup);

                });

                this.draggableElements = tmpDraggableElements;

            }

        }

    }

    dragStart(event: DragEvent, value: string): void {

        if (event !== null && event !== undefined) {
            if (event.dataTransfer !== null && event.dataTransfer !== undefined) {

                event.dataTransfer.setData('type', value);
                this.dialogRef.close();

            }
        }

    }

}
