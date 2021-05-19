import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoRichtextComponent } from './richtext/richtext.component';
import { DemoHugeDocumentComponent } from './huge-document/huge-document.component';
import { DemoMarkdownShortcutsComponent } from './markdown-shorcuts/markdown-shortcuts.component';
import { DemoTablesComponent } from './tables/tables.component';
import { DemoImagesComponent } from './images/images.component';

const routes: Routes = [
    {
        path: '',
        component: DemoRichtextComponent
    },
    {
        path: 'huge-document',
        component: DemoHugeDocumentComponent
    },
    {
        path: 'markdown-shortcuts',
        component: DemoMarkdownShortcutsComponent
    },
    {
        path: 'tables',
        component: DemoTablesComponent
    },
    {
        path: 'images',
        component: DemoImagesComponent
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
