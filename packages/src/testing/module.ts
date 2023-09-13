import { CommonModule } from '@angular/common';
import { Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { SlateModule } from '../module';
import { FormsModule } from '@angular/forms';

export function configureBasicEditableTestingModule(declarations: any[], entryComponents: any[] = [], providers: Provider[] = []) {
    TestBed.configureTestingModule({
        declarations: declarations,
        imports: [CommonModule, BrowserModule, SlateModule, FormsModule],
        providers: [...providers],
        teardown: { destroyAfterEach: false }
    }).compileComponents();
}
