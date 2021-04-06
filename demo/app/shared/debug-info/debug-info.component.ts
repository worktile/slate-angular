import { Component, OnInit, Input } from '@angular/core';
import { Editor, Operation } from 'slate';

@Component({
    selector: 'demo-debug-info',
    templateUrl: 'debug-info.component.html'
})
export class DemoDebugInfoComponent implements OnInit {
    dev = false;

    @Input()
    theEditor: Editor;

    @Input()
    currentOperations: Operation[];

    ngOnInit(): void {
        this.dev = localStorage.getItem('slate-angular-dev') === 'true' ? true : false;
    }
}
