import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOffice } from 'app/shared/model/office.model';

@Component({
    selector: 'jhi-office-detail',
    templateUrl: './office-detail.component.html'
})
export class OfficeDetailComponent implements OnInit {
    office: IOffice;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ office }) => {
            this.office = office;
        });
    }

    previousState() {
        window.history.back();
    }
}
