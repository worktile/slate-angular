import { CommonModule } from "@angular/common";
import { Provider } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { BrowserModule } from "@angular/platform-browser";
import { SlateModule } from "../module";
import { FormsModule } from "@angular/forms";

export function configureBasicEditableTestingModule(declarations: any[], providers: Provider[] = []) {
    TestBed.configureTestingModule({
        imports: [
            CommonModule, BrowserModule, SlateModule, FormsModule
        ],
        declarations: [...declarations],
        providers: [
            ...providers
        ],
    }).compileComponents();
}
