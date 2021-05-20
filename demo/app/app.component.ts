import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'demo-app-root',
    templateUrl: './app.component.html',
    providers: [],
})
export class AppComponent implements OnInit {
    menus = [
        {
            url: '/',
            name: 'RichText'
        },
        {
            url: '/huge-document',
            name: 'Huge Document'
        },
        {
            url: '/markdown-shortcuts',
            name: 'Markdown Shortcuts'
        },
        {
            url: '/tables',
            name: 'Tables'
        },
        {
            url: '/images',
            name: 'Images'
        },
        {
            url: '/search-highlighting',
            name: 'Search highlighting'
        },
    ];

    isSelected(item) {
        return window.location.href.endsWith(item.url);
    }

    ngOnInit(): void {}
}
