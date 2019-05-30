import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { IUrl, Url } from 'app/shared/model/url.model';
import { UrlService } from './url.service';
import * as moment from 'moment';

@Injectable()
export class UrlPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private urlService: UrlService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                if (id instanceof Url) {
                    this.ngbModalRef = this.urlModalRef(component, id);
                    resolve(this.ngbModalRef);
                } else {
                    this.urlService.find(id)
                        .subscribe((urlResponse: HttpResponse<IUrl>) => {
                            const url: IUrl = urlResponse.body;
                            url.createdDate = url.createdDate != null ? moment(url.createdDate) : null;
                            url.lastModifiedDate = url.lastModifiedDate != null ? moment(url.lastModifiedDate) : null;
                            this.ngbModalRef = this.urlModalRef(component, url);
                            resolve(this.ngbModalRef);
                        });
                }
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.urlModalRef(component, new Url());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    urlModalRef(component: Component, url: IUrl): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.url = url;
        modalRef.result.then(result => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, reason => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
