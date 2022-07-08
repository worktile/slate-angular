import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DemoMarkdownShortcutsComponent } from './markdown-shorcuts/markdown-shortcuts.component';
import { DemoRichtextComponent } from './richtext/richtext.component';
import { DemoHugeDocumentComponent } from './huge-document/huge-document.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { SlateModule } from 'slate-angular';
import { DemoElementImageComponent } from './components/image/image-component';
import { DemoTextMarkComponent } from './components/text/text.component';
import { DemoButtonComponent } from './components/button/button.component';
import { DemoTablesComponent } from './tables/tables.component';
import { DemoImagesComponent } from './images/images.component';
import { DemoSearchHighlightingComponent } from './search-highlighting/search-highlighting.component';
import { DemoLeafComponent } from './search-highlighting/leaf.component';
import { DemoMentionsComponent } from './mentions/mentions.component';
import { DemoReadonlyComponent } from './readonly/readonly.component';
import { DemoPlaceholderComponent } from './placeholder/placeholder.component';
import { DemoElementEditableButtonComponent } from './components/editable-button/editable-button.component';
import { DemoInlinesComponent } from './inlines/inlines.component';
import { DemoElementLinkComponent } from './components/link/link.component';

@NgModule({
    declarations: [
        AppComponent,
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
        DemoElementLinkComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        SlateModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {}
}
