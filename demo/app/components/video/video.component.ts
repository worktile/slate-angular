import { ChangeDetectorRef, Component, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Element as SlateElement, Transforms } from 'slate';
import { AngularEditor, BaseElementComponent, SlateChildren } from 'slate-angular';
import { VideoElement } from 'custom-types';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'demo-video',
    standalone: true,
    imports: [CommonModule, SlateChildren],
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class DemoElementVideoComponent extends BaseElementComponent<VideoElement> {
    constructor(
        private sanitizer: DomSanitizer,
        elementRef: ElementRef,
        cdr: ChangeDetectorRef
    ) {
        super(elementRef, cdr);
    }

    get url(): SafeUrl {
        return this.element.url ? this.sanitizer.bypassSecurityTrustResourceUrl(this.element.url + '?title=0&byline=0&portrait=0') : '';
    }

    inputChange(event: Event) {
        const newUrl = (event.target as HTMLInputElement).value;
        const path = AngularEditor.findPath(this.editor, this.element);
        const newProperties: Partial<SlateElement> = {
            url: newUrl
        };
        Transforms.setNodes<SlateElement>(this.editor, newProperties, {
            at: path
        });
    }
}
