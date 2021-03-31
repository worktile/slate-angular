import { Component, OnInit, Input } from '@angular/core';
import { Operation } from 'slate';
import { TheEditor } from 'theia-editor';

@Component({
    selector: 'demo-debug-info',
    templateUrl: 'debug-info.component.html'
})
export class DemoDebugInfoComponent implements OnInit {
    dev = false;

    @Input()
    theEditor: TheEditor;

    @Input()
    currentOperations: Operation[];

    ngOnInit(): void {
        this.dev = localStorage.getItem('slate-angular-dev') === 'true' ? true : false;
    }
}
