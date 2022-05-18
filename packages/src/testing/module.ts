import { CommonModule } from "@angular/common";
import { NgModule, Provider } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { BrowserModule } from "@angular/platform-browser";
import { SlateModule } from "../module";
import { FormsModule } from "@angular/forms";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { TestingLeafComponent } from "./leaf.component";

export function configureBasicEditableTestingModule(declarations: any[], entryComponents: any[] = [], providers: Provider[] = []) {
    TestBed.configureTestingModule({
    imports: [
        CommonModule, BrowserModule, SlateModule, FormsModule
    ],
    declarations: [...declarations],
    providers: [
        ...providers
    ],
    teardown: { destroyAfterEach: false }
}).overrideModule(BrowserDynamicTestingModule, {
        set: {
            entryComponents: entryComponents,
        }
    }).compileComponents();
}
