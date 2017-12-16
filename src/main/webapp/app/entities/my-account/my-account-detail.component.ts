import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { MyAccount } from './my-account.model';
import { MyAccountService } from './my-account.service';

@Component({
    selector: 'jhi-my-account-detail',
    templateUrl: './my-account-detail.component.html'
})
export class MyAccountDetailComponent implements OnInit, OnDestroy {

    myAccount: MyAccount;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private myAccountService: MyAccountService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInMyAccounts();
    }

    load(id) {
        this.myAccountService.find(id).subscribe((myAccount) => {
            this.myAccount = myAccount;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInMyAccounts() {
        this.eventSubscriber = this.eventManager.subscribe(
            'myAccountListModification',
            (response) => this.load(this.myAccount.id)
        );
    }
}
