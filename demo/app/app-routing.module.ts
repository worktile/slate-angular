import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoRichtextComponent } from './richtext/richtext.component';
import { DemoHugeDocumentComponent } from './huge-document/huge-document.component';
import { DemoMarkdownShortcutsComponent } from './markdown-shorcuts/markdown-shortcuts.component';
import { DemoTablesComponent } from './tables/tables.component';
import { DemoImagesComponent } from './images/images.component';
import { DemoSearchHighlightingComponent } from './search-highlighting/search-highlighting.component';
import { DemoMentionsComponent } from './mentions/mentions.component';
import { DemoReadonlyComponent } from './readonly/readonly.component';

const routes: Routes = [
    {
        path: 'readonly',
        component: DemoReadonlyComponent
    },
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
    },
    {
        path: 'search-highlighting',
        component: DemoSearchHighlightingComponent
    },
    {
        path: 'mentions',
        component: DemoMentionsComponent
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
