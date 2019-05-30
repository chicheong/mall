import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { FileUploadDialogComponent } from './file-upload-dialog.component';
import { IUrl } from 'app/shared/model/url.model';

@Injectable()
export class FileUploadModelService {
    private isOpen = false;

    constructor(
        private modalService: NgbModal,
    ) {}

    open(url?: IUrl, maxSize?: number, maxFiles?: number, fileExt?: string, broadcastName?: string): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
        const modalRef = this.modalService.open(FileUploadDialogComponent, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.url = url;
        if (maxSize) {
            modalRef.componentInstance.maxSize = maxSize;
        }
        if (maxFiles) {
            modalRef.componentInstance.maxFiles = maxFiles;
        }
        if (fileExt) {
            modalRef.componentInstance.fileExt = fileExt;
        }
        if (broadcastName) {
            modalRef.componentInstance.broadcastName = broadcastName;
        }
        modalRef.result.then(result => {
            this.isOpen = false;
        }, reason => {
            this.isOpen = false;
        });
        return modalRef;
    }
}
