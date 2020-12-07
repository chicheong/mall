import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: [
        'search-bar.scss'
    ]
})
export class SearchBarComponent {
    constructor(
        private router: Router
    ) {}

    private goto(id: number): void {
        this.router.navigate(['/product', id, 'view']);
    }
}
