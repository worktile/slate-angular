import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DemoMarkdownShortcutsComponent } from './markdown-shorcuts/markdown-shortcuts.component';
import { DemoRichtextComponent } from './richtext/richtext.component';
import { DemoHugeDocumentComponent } from './huge-document/huge-document.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { SlateModule } from 'packages/src/slate.module';
import { DemoElementImageComponent } from './components/image/image-component';

@NgModule({
    declarations: [
        AppComponent,
        DemoRichtextComponent,
        DemoMarkdownShortcutsComponent,
        DemoHugeDocumentComponent,
        DemoElementImageComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        SlateModule
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() {
        
    }
}
