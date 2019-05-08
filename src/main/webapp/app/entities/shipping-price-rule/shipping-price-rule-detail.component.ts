import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { ShippingPriceRule } from './shipping-price-rule.model';
import { ShippingPriceRuleService } from './shipping-price-rule.service';

@Component({
    selector: 'jhi-shipping-price-rule-detail',
    templateUrl: './shipping-price-rule-detail.component.html'
})
export class ShippingPriceRuleDetailComponent implements OnInit, OnDestroy {

    shippingPriceRule: ShippingPriceRule;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private shippingPriceRuleService: ShippingPriceRuleService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInShippingPriceRules();
    }

    load(id) {
        this.shippingPriceRuleService.find(id)
            .subscribe((shippingPriceRuleResponse: HttpResponse<ShippingPriceRule>) => {
                this.shippingPriceRule = shippingPriceRuleResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInShippingPriceRules() {
        this.eventSubscriber = this.eventManager.subscribe(
            'shippingPriceRuleListModification',
            (response) => this.load(this.shippingPriceRule.id)
        );
    }
}
