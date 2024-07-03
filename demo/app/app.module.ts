import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SlateModule } from 'slate-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DemoButtonComponent } from './components/button/button.component';
import { DemoElementEditableButtonComponent } from './components/editable-button/editable-button.component';
import { DemoElementImageComponent } from './components/image/image-component';
import { DemoElementLinkComponent } from './components/link/link.component';
import { DemoTextMarkComponent } from './components/text/text.component';
import { DemoEditableVoidsComponent } from './editable-voids/editable-voids.component';
import { DemoEmbedsComponent } from './embeds/embeds.component';
import { DemoHugeDocumentComponent } from './huge-document/huge-document.component';
import { DemoImagesComponent } from './images/images.component';
import { DemoInlinesComponent } from './inlines/inlines.component';
import { DemoMarkdownShortcutsComponent } from './markdown-shorcuts/markdown-shortcuts.component';
import {
    DemoAttachmentComponent,
    DemoAttachmentFileComponent,
    DemoAttachmentTextComponent,
    DemoMentionsComponent
} from './mentions/mentions.component';
import { DemoPlaceholderComponent } from './placeholder/placeholder.component';
import { DemoReadonlyComponent } from './readonly/readonly.component';
import { DemoRichtextComponent } from './richtext/richtext.component';
import { DemoLeafComponent } from './search-highlighting/leaf.component';
import { DemoSearchHighlightingComponent } from './search-highlighting/search-highlighting.component';
import { DemoTablesComponent } from './tables/tables.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        SlateModule,
        DemoButtonComponent,
        DemoRichtextComponent,
        DemoMarkdownShortcutsComponent,
        DemoHugeDocumentComponent,
        DemoElementImageComponent,
        DemoTextMarkComponent,
        DemoTablesComponent,
        DemoTablesComponent,
        DemoImagesComponent,
        DemoSearchHighlightingComponent,
        DemoLeafComponent,
        DemoMentionsComponent,
        DemoReadonlyComponent,
        DemoPlaceholderComponent,
        DemoElementEditableButtonComponent,
        DemoInlinesComponent,
        DemoElementLinkComponent,
        DemoEditableVoidsComponent,
        DemoEmbedsComponent,
        DemoAttachmentComponent,
        DemoAttachmentTextComponent,
        DemoAttachmentFileComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() {}
}
