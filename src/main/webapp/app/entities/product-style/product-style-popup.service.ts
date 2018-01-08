import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProductStyle } from './product-style.model';
import { ProductStyleService } from './product-style.service';

@Injectable()
export class ProductStylePopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private productStyleService: ProductStyleService

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
                if (id instanceof ProductStyle) {
                    console.error('id: ' + id);
                    console.error('type: ' + id.type);
                    this.ngbModalRef = this.productStyleModalRef(component, id);
                    resolve(this.ngbModalRef);
                } else {
                    this.productStyleService.find(id).subscribe((productStyle) => {
                        this.ngbModalRef = this.productStyleModalRef(component, productStyle);
                        resolve(this.ngbModalRef);
                    });
                }
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.productStyleModalRef(component, new ProductStyle());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    productStyleModalRef(component: Component, productStyle: ProductStyle): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.productStyle = productStyle;
        modalRef.result.then((result) => {
            console.error('modalRef.result.then: ' + modalRef.result);
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
