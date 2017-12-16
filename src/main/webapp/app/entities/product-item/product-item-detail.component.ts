import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { ProductItem } from './product-item.model';
import { ProductItemService } from './product-item.service';

@Component({
    selector: 'jhi-product-item-detail',
    templateUrl: './product-item-detail.component.html'
})
export class ProductItemDetailComponent implements OnInit, OnDestroy {

    productItem: ProductItem;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private productItemService: ProductItemService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInProductItems();
    }

    load(id) {
        this.productItemService.find(id).subscribe((productItem) => {
            this.productItem = productItem;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInProductItems() {
        this.eventSubscriber = this.eventManager.subscribe(
            'productItemListModification',
            (response) => this.load(this.productItem.id)
        );
    }
}
