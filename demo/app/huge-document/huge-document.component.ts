import { Component, OnInit, AfterViewInit, NgZone, HostListener, ViewChild, ElementRef } from '@angular/core';
import { faker } from '@faker-js/faker';
import { createEditor } from 'slate';
import { withAngular } from 'slate-angular';
import { take } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { SlateEditable } from '../../../packages/src/components/editable/editable.component';
import { H1Flavour } from '../flavours/heading.flavour';

@Component({
    selector: 'demo-huge-document',
    templateUrl: 'huge-document.component.html',
    imports: [SlateEditable, FormsModule]
})
export class DemoHugeDocumentComponent implements OnInit, AfterViewInit {
    mode: 'default' | 'component' | 'virtual' = 'default';

    value = buildInitialValue();

    componentValue = [
        {
            type: 'paragraph',
            children: [{ text: faker.lorem.paragraph() }]
        }
    ];

    editor = withAngular(createEditor());

    virtualConfig = {
        enabled: true,
        scrollTop: 0,
        viewportHeight: 0,
        blockHeight: 57,
        buffer: 3
    };

    @ViewChild('demoContainer') demoContainer?: ElementRef<HTMLDivElement>;

    constructor(private ngZone: NgZone) {}

    ngOnInit() {
        console.time();
    }

    ngAfterViewInit(): void {
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            console.timeEnd();
        });
        this.syncVirtualConfig();
    }

    switchScrollMode(mode: 'default' | 'component' | 'virtual') {
        this.mode = mode;
        this.syncVirtualConfig();
    }

    @HostListener('window:scroll')
    onWindowScroll() {
        this.syncVirtualConfig();
    }

    @HostListener('window:resize')
    onWindowResize() {
        this.syncVirtualConfig();
    }

    renderElement() {
        return (element: any) => {
            if (element.type === 'heading-one') {
                return H1Flavour;
            }
            return null;
        };
    }

    valueChange(event) {}

    private syncVirtualConfig() {
        if (this.mode !== 'virtual') {
            return;
        }
        this.virtualConfig = {
            ...this.virtualConfig,
            scrollTop: window.scrollY || 0,
            viewportHeight: window.innerHeight || 0
        };
    }
}

export const buildInitialValue = () => {
    const HEADINGS = 2000;
    const PARAGRAPHS = 7;
    const initialValue = [];

    for (let h = 0; h < HEADINGS; h++) {
        initialValue.push({
            type: 'heading-one',
            children: [{ text: faker.lorem.sentence() }]
        });

        for (let p = 0; p < PARAGRAPHS; p++) {
            initialValue.push({
                type: 'paragraph',
                children: [{ text: faker.lorem.paragraph() }]
            });
        }
    }
    initialValue.push({
        type: 'paragraph',
        children: [{ text: '==== END ====' }]
    });
    return initialValue;
};
