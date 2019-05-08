import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { OrderShop } from './order-shop.model';
import { OrderShopService } from './order-shop.service';

@Component({
    selector: 'jhi-order-shop-detail',
    templateUrl: './order-shop-detail.component.html'
})
export class OrderShopDetailComponent implements OnInit, OnDestroy {

    orderShop: OrderShop;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private orderShopService: OrderShopService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInOrderShops();
    }

    load(id) {
        this.orderShopService.find(id)
            .subscribe((orderShopResponse: HttpResponse<OrderShop>) => {
                this.orderShop = orderShopResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInOrderShops() {
        this.eventSubscriber = this.eventManager.subscribe(
            'orderShopListModification',
            (response) => this.load(this.orderShop.id)
        );
    }
}
