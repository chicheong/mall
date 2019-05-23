import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMyAccount } from 'app/shared/model/my-account.model';

@Component({
    selector: 'jhi-my-account-detail',
    templateUrl: './my-account-detail.component.html'
})
export class MyAccountDetailComponent implements OnInit {
    myAccount: IMyAccount;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ myAccount }) => {
            this.myAccount = myAccount;
        });
    }

    previousState() {
        window.history.back();
    }
}
