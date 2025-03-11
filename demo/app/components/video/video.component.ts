import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { VideoElement } from 'custom-types';
import { Element as SlateElement, Transforms } from 'slate';
import { AngularEditor, BaseElementComponent, SlateChildren } from 'slate-angular';

@Component({
    selector: 'demo-video',
    standalone: true,
    imports: [SlateChildren],
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class DemoElementVideoComponent extends BaseElementComponent<VideoElement> {
    private sanitizer = inject(DomSanitizer);

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
