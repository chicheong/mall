import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { IUrl } from 'app/shared/model/url.model';
import { UrlService } from './url.service';

@Component({
    selector: 'jhi-url-update',
    templateUrl: './url-update.component.html'
})
export class UrlUpdateComponent implements OnInit {
    url: IUrl;
    isSaving: boolean;
    createdDate: string;
    lastModifiedDate: string;

    constructor(protected urlService: UrlService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ url }) => {
            this.url = url;
            this.createdDate = this.url.createdDate != null ? this.url.createdDate.format(DATE_TIME_FORMAT) : null;
            this.lastModifiedDate = this.url.lastModifiedDate != null ? this.url.lastModifiedDate.format(DATE_TIME_FORMAT) : null;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.url.createdDate = this.createdDate != null ? moment(this.createdDate, DATE_TIME_FORMAT) : null;
        this.url.lastModifiedDate = this.lastModifiedDate != null ? moment(this.lastModifiedDate, DATE_TIME_FORMAT) : null;
        if (this.url.id !== undefined) {
            this.subscribeToSaveResponse(this.urlService.update(this.url));
        } else {
            this.subscribeToSaveResponse(this.urlService.create(this.url));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IUrl>>) {
        result.subscribe((res: HttpResponse<IUrl>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
