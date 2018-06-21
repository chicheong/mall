import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { ShippingType } from './shipping-type.model';
import { ShippingTypeService } from './shipping-type.service';

@Component({
    selector: 'jhi-shipping-type-detail',
    templateUrl: './shipping-type-detail.component.html'
})
export class ShippingTypeDetailComponent implements OnInit, OnDestroy {

    shippingType: ShippingType;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private shippingTypeService: ShippingTypeService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInShippingTypes();
    }

    load(id) {
        this.shippingTypeService.find(id)
            .subscribe((shippingTypeResponse: HttpResponse<ShippingType>) => {
                this.shippingType = shippingTypeResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInShippingTypes() {
        this.eventSubscriber = this.eventManager.subscribe(
            'shippingTypeListModification',
            (response) => this.load(this.shippingType.id)
        );
    }
}
