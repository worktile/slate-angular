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
        viewportHeight: 0
    };

    anchorKey = '';

    @ViewChild('demoContainer') demoContainer?: ElementRef<HTMLDivElement>;

    constructor(private ngZone: NgZone) {}

    ngOnInit() {
        console.time();
    }

    ngAfterViewInit(): void {
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            console.timeEnd();
        });
        this.syncvirtualScrollConfig();
    }

    switchScrollMode(mode: 'default' | 'component' | 'virtual') {
        this.mode = mode;
        this.syncvirtualScrollConfig();
    }

    @HostListener('window:scroll')
    onWindowScroll() {
        this.syncvirtualScrollConfig();
    }

    @HostListener('window:resize')
    onWindowResize() {
        this.syncvirtualScrollConfig();
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

    private syncvirtualScrollConfig() {
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
        const anchorElement = this.editor.children.find(
            child => AngularEditor.findKey(this.editor, child)?.id === this.anchorKey
        ) as Element;
        scrollToElement(this.editor, anchorElement, (scrollTop: number) => {
            window.scrollTo(0, scrollTop + this.demoContainer?.nativeElement.getBoundingClientRect().top - 20);
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
