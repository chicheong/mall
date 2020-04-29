import { Component, Input } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

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

    private goto(id) {
        this.router.navigate(['/product', id, 'view']);
    }
}
