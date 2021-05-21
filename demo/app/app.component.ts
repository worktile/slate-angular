import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
            name: 'Search Highlighting'
        },
    ];

    showSideNav: boolean;

    get activeNav() {
        return this.menus.filter(item=> window.location.href.endsWith(item.url))[0];
    }

    @ViewChild('sideNav', { static: false }) sideNav: ElementRef

    isSelected(item) {
        return window.location.href.endsWith(item.url);
    }

    onBreadClick() {
        this.showSideNav = !this.showSideNav;
    }

    ngOnInit(): void {
    }
}
