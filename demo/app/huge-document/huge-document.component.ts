import { Component, OnInit, AfterViewInit, NgZone, HostListener, ViewChild, ElementRef } from '@angular/core';
import { faker } from '@faker-js/faker';
import { createEditor, Element } from 'slate';
import { AngularEditor, scrollToElement, withAngular } from 'slate-angular';
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
    mode: 'default' | 'component' | 'virtual' = 'virtual';

    value = buildInitialValue();

    componentValue = [
        {
            type: 'paragraph',
            children: [{ text: faker.lorem.paragraph() }]
        }
    ];

    editor = withAngular(createEditor());

    virtualScrollConfig = {
        enabled: true,
        scrollTop: 0,
        viewportHeight: 0,
        viewportBoundingTop: 0
    };

    anchorKey = '';

    @ViewChild('demoContainer') demoContainer?: ElementRef<HTMLDivElement>;

    constructor(private ngZone: NgZone) {}

    ngOnInit() {
        if (!localStorage.getItem('huge-document-value')) {
            localStorage.setItem('huge-document-value', JSON.stringify(this.value));
        } else {
            this.value = JSON.parse(localStorage.getItem('huge-document-value') || '[]');
        }
    }

    ngAfterViewInit(): void {
        this.syncVirtualScrollConfig();
    }

    switchScrollMode(mode: 'default' | 'component' | 'virtual') {
        this.mode = mode;
        this.syncVirtualScrollConfig();
    }

    @HostListener('window:scroll')
    onWindowScroll() {
        this.syncVirtualScrollConfig();
    }

    @HostListener('window:resize')
    onWindowResize() {
        this.syncVirtualScrollConfig();
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

    private syncVirtualScrollConfig() {
        if (this.mode !== 'virtual') {
            return;
        }
        this.virtualScrollConfig = {
            ...this.virtualScrollConfig,
            scrollTop: window.scrollY || 0,
            viewportHeight: window.innerHeight || 0
        };
    }

    anchorScroll() {
        const anchorElement = this.editor.children[1300] as Element;
        scrollToElement(this.editor, anchorElement, (scrollTop: number) => {
            window.scrollTo(0, scrollTop);
        });
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
