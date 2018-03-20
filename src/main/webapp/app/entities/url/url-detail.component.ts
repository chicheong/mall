import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Url } from './url.model';
import { UrlService } from './url.service';

@Component({
    selector: 'jhi-url-detail',
    templateUrl: './url-detail.component.html'
})
export class UrlDetailComponent implements OnInit, OnDestroy {

    url: Url;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private urlService: UrlService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInUrls();
    }

    load(id) {
        this.urlService.find(id)
            .subscribe((urlResponse: HttpResponse<Url>) => {
                this.url = urlResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInUrls() {
        this.eventSubscriber = this.eventManager.subscribe(
            'urlListModification',
            (response) => this.load(this.url.id)
        );
    }
}
