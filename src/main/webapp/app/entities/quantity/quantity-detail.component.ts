import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { Quantity } from './quantity.model';
import { QuantityService } from './quantity.service';

@Component({
    selector: 'jhi-quantity-detail',
    templateUrl: './quantity-detail.component.html'
})
export class QuantityDetailComponent implements OnInit, OnDestroy {

    quantity: Quantity;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private quantityService: QuantityService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInQuantities();
    }

    load(id) {
        this.quantityService.find(id).subscribe((quantity) => {
            this.quantity = quantity;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInQuantities() {
        this.eventSubscriber = this.eventManager.subscribe(
            'quantityListModification',
            (response) => this.load(this.quantity.id)
        );
    }
}
