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
import { DemoMarkTextComponent } from './components/text/text.component';
import { DemoButtonComponent } from './components/button/button.component';
import { DemoTablesComponent } from './tables/tables.component';
import { DemoImagesComponent } from './images/images.component';

@NgModule({
    declarations: [
        AppComponent,
        DemoButtonComponent,
        DemoRichtextComponent,
        DemoMarkdownShortcutsComponent,
        DemoHugeDocumentComponent,
        DemoElementImageComponent,
        DemoMarkTextComponent,
        DemoTablesComponent,
        DemoImagesComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        SlateModule
    ],
    entryComponents: [DemoMarkTextComponent, DemoElementImageComponent],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() {
        
    }
}
