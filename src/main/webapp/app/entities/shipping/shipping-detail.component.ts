import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Shipping } from './shipping.model';
import { ShippingService } from './shipping.service';

@Component({
    selector: 'jhi-shipping-detail',
    templateUrl: './shipping-detail.component.html'
})
export class ShippingDetailComponent implements OnInit, OnDestroy {

    shipping: Shipping;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private shippingService: ShippingService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInShippings();
    }

    load(id) {
        this.shippingService.find(id)
            .subscribe((shippingResponse: HttpResponse<Shipping>) => {
                this.shipping = shippingResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInShippings() {
        this.eventSubscriber = this.eventManager.subscribe(
            'shippingListModification',
            (response) => this.load(this.shipping.id)
        );
    }
}
