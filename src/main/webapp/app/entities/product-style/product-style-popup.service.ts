import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IProductStyle, ProductStyle } from 'app/shared/model/product-style.model';
import { ProductStyleService } from './product-style.service';

@Injectable({ providedIn: 'root' })
export class ProductStylePopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private productStyleService: ProductStyleService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any, broadcastName?: string): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                if (id instanceof ProductStyle) {
                    console.error('id: ' + id);
                    console.error('type: ' + id.type);
                    this.ngbModalRef = this.productStyleModalRef(component, id, broadcastName);
                    resolve(this.ngbModalRef);
                } else {
                    this.productStyleService.find(id).subscribe((productStyleResponse: HttpResponse<IProductStyle>) => {
                        this.ngbModalRef = this.productStyleModalRef(component, productStyleResponse.body, broadcastName);
                        resolve(this.ngbModalRef);
                    });
                }
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.productStyleModalRef(component, new ProductStyle(), broadcastName);
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    productStyleModalRef(component: Component, productStyle: IProductStyle, broadcastName?: string): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.productStyle = productStyle;
        modalRef.componentInstance.broadcastName = broadcastName;
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
