import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { State } from './state.model';
import { StateService } from './state.service';

@Component({
    selector: 'jhi-state-detail',
    templateUrl: './state-detail.component.html'
})
export class StateDetailComponent implements OnInit, OnDestroy {

    state: State;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private stateService: StateService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInStates();
    }

    load(id) {
        this.stateService.find(id)
            .subscribe((stateResponse: HttpResponse<State>) => {
                this.state = stateResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInStates() {
        this.eventSubscriber = this.eventManager.subscribe(
            'stateListModification',
            (response) => this.load(this.state.id)
        );
    }
}
