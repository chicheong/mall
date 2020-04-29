import { Component, Input } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { IProduct } from 'app/shared/model/product.model';

@Component({
    selector: 'jhi-product-card',
    templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
    @Input() product: IProduct;

    constructor(
        private router: Router
    ) {}

    private goto(id) {
        this.router.navigate(['/product', id, 'view']);
    }
}
