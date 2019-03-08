import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { FileUploadDialogComponent } from './file-upload-dialog.component';
import { Url } from '../../entities/url';

@Injectable()
export class FileUploadModelService {
    private isOpen = false;

    constructor(
        private modalService: NgbModal,
    ) {}

    open(url?: Url): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
        const modalRef = this.modalService.open(FileUploadDialogComponent, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.url = url;
        modalRef.result.then((result) => {
            this.isOpen = false;
        }, (reason) => {
            this.isOpen = false;
        });
        return modalRef;
    }
}
