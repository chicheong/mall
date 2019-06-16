import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMyState } from 'app/shared/model/my-state.model';

@Component({
    selector: 'jhi-my-state-detail',
    templateUrl: './my-state-detail.component.html'
})
export class MyStateDetailComponent implements OnInit {
    myState: IMyState;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ myState }) => {
            this.myState = myState;
        });
    }

    previousState() {
        window.history.back();
    }
}
