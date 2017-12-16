import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { Office } from './office.model';
import { OfficeService } from './office.service';

@Component({
    selector: 'jhi-office-detail',
    templateUrl: './office-detail.component.html'
})
export class OfficeDetailComponent implements OnInit, OnDestroy {

    office: Office;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private officeService: OfficeService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInOffices();
    }

    load(id) {
        this.officeService.find(id).subscribe((office) => {
            this.office = office;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInOffices() {
        this.eventSubscriber = this.eventManager.subscribe(
            'officeListModification',
            (response) => this.load(this.office.id)
        );
    }
}
