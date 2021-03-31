import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DemoDebugInfoComponent } from './debug-info/debug-info.component';

@NgModule({
    declarations: [
        DemoDebugInfoComponent
    ],
    imports: [BrowserModule],
    exports: [
        DemoDebugInfoComponent
    ],
    providers: []
})
export class DemoSharedModule {
    constructor() {}
}
