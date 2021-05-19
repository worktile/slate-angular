import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoRichtextComponent } from './richtext/richtext.component';
import { DemoHugeDocumentComponent } from './huge-document/huge-document.component';
import { DemoMarkdownShortcutsComponent } from './markdown-shorcuts/markdown-shortcuts.component';
import { DemoTableComponent } from './table/table.component';

const routes: Routes = [
    {
        path: '',
        component: DemoRichtextComponent
    },
    {
        path: 'table',
        component: DemoTableComponent
    },
    {
        path: 'huge-document',
        component: DemoHugeDocumentComponent
    },
    {
        path: 'markdown-shortcuts',
        component: DemoMarkdownShortcutsComponent
    }
];
@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            useHash: false
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
