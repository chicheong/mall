import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from 'app/shared/model/product.model';

@Component({
    selector: 'jhi-product-card',
    templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Input() product?: IProduct;

    constructor(
        private router: Router
    ) {}

    goto(id: number): void {
        this.router.navigate(['/product', id, 'view']);
    }
}
