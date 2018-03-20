import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Url } from './url.model';
import { UrlPopupService } from './url-popup.service';
import { UrlService } from './url.service';

@Component({
    selector: 'jhi-url-dialog',
    templateUrl: './url-dialog.component.html'
})
export class UrlDialogComponent implements OnInit {

    url: Url;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private urlService: UrlService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.url.id !== undefined) {
            this.subscribeToSaveResponse(
                this.urlService.update(this.url));
        } else {
            this.subscribeToSaveResponse(
                this.urlService.create(this.url));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Url>>) {
        result.subscribe((res: HttpResponse<Url>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Url) {
        this.eventManager.broadcast({ name: 'urlListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-url-popup',
    template: ''
})
export class UrlPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private urlPopupService: UrlPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.urlPopupService
                    .open(UrlDialogComponent as Component, params['id']);
            } else {
                this.urlPopupService
                    .open(UrlDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
