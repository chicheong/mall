import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDelegation } from 'app/shared/model/delegation.model';

@Component({
    selector: 'jhi-delegation-detail',
    templateUrl: './delegation-detail.component.html'
})
export class DelegationDetailComponent implements OnInit {
    delegation: IDelegation;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ delegation }) => {
            this.delegation = delegation;
        });
    }

    previousState() {
        window.history.back();
    }
}
