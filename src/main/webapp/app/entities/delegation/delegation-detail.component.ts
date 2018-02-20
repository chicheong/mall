import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Delegation } from './delegation.model';
import { DelegationService } from './delegation.service';

@Component({
    selector: 'jhi-delegation-detail',
    templateUrl: './delegation-detail.component.html'
})
export class DelegationDetailComponent implements OnInit, OnDestroy {

    delegation: Delegation;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private delegationService: DelegationService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInDelegations();
    }

    load(id) {
        this.delegationService.find(id)
            .subscribe((delegationResponse: HttpResponse<Delegation>) => {
                this.delegation = delegationResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInDelegations() {
        this.eventSubscriber = this.eventManager.subscribe(
            'delegationListModification',
            (response) => this.load(this.delegation.id)
        );
    }
}
