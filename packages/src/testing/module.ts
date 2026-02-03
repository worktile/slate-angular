import { CommonModule } from '@angular/common';
import { Provider, provideZoneChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SlateModule } from '../module';

export function configureBasicEditableTestingModule(declarations: any[], entryComponents: any[] = [], providers: Provider[] = []) {
    TestBed.configureTestingModule({
        declarations: declarations,
        imports: [CommonModule, BrowserModule, SlateModule, FormsModule],
        providers: [...providers, provideZoneChangeDetection()],
        teardown: { destroyAfterEach: false }
    }).compileComponents();
}
