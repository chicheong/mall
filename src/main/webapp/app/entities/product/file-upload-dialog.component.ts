import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiAlert } from 'ng-jhipster';

import { Product } from './product.model';
import { Url } from './../url';

@Component({
    selector: 'jhi-file-upload-dialog',
    templateUrl: './file-upload-dialog.component.html',
    styleUrls: [
        'file-upload.scss'
    ]
})
export class FileUploadDialogComponent implements OnInit {
    errors: Array<JhiAlert> = [];
    dragAreaClass = 'dragarea';
    @Input() fileExt = 'JPG, GIF, PNG';
    @Input() maxFiles = 5;
    @Input() maxSize = 5; // 5MB
    // @Output() uploadStatus = new EventEmitter();

    product: Product;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    ok() {
        this.activeModal.dismiss('OK');
    }

    @HostListener('dragover', ['$event']) onDragOver(event) {
        this.dragAreaClass = 'droparea';
        event.preventDefault();
    }

    @HostListener('dragenter', ['$event']) onDragEnter(event) {
        this.dragAreaClass = 'droparea';
        event.preventDefault();
    }

    @HostListener('dragend', ['$event']) onDragEnd(event) {
        this.dragAreaClass = 'dragarea';
        event.preventDefault();
    }

    @HostListener('dragleave', ['$event']) onDragLeave(event) {
        this.dragAreaClass = 'dragarea';
        event.preventDefault();
    }

    @HostListener('drop', ['$event']) onDrop(event) {
        this.dragAreaClass = 'dragarea';
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer.files;
        if (this.isValidFiles(files)) {
            const urls = [];
            let counter = 0;
            for (let i = 0; i < files.length; i++) {
                const reader = new FileReader();
                const file = files[i];
                reader.readAsDataURL(file);
                reader.onload = (thisEvent) => { // called once readAsDataURL is completed
                    const url = new Url();
                    url.entityType = Product.name;
                    url.entityId = this.product.id;
//                    url.file = file;
                    url.path = (<FileReader>thisEvent.target).result;
                    urls.push(url);
                    counter++;
                    if (counter === files.length) {
                        this.eventManager.broadcast({ name: 'filesModification', content: 'OK', obj: urls});
                        this.activeModal.dismiss('OK');
                    }
                };
            }
        } else {
            this.errors.forEach((error) => {
                this.jhiAlertService.error(error.msg, error.params, null);
            });
        }
    }

    onFileChange(event) {
        const files = event.target.files;
        if (this.isValidFiles(files)) {
            const urls = [];
            let counter = 0;
            for (let i = 0; i < files.length; i++) {
                const reader = new FileReader();
                const file = files[i];
                reader.readAsDataURL(file);
                reader.onload = (thisEvent) => { // called once readAsDataURL is completed
                    const url = new Url();
                    url.entityType = Product.name;
                    url.entityId = this.product.id;
//                    url.file = file;
                    url.path = (<FileReader>thisEvent.target).result;
                    urls.push(url);
                    counter++;
                    if (counter === files.length) {
                        this.eventManager.broadcast({ name: 'filesModification', content: 'OK', obj: urls});
                        this.activeModal.dismiss('OK');
                    }
                };
            }
        } else {
            this.errors.forEach((error) => {
                this.jhiAlertService.error(error.msg, error.params, null);
            });
        }
    }

    private isValidFiles(files) {
        this.errors = [];
        // Check Number of files
        if (files.length <= 0) {
            this.errors.push(
                {
                    type: 'danger',
                    msg: 'mallApp.fileUpload.error.oneFile',
                    params: {}
                }
            );
        }
        if (files.length > this.maxFiles) {
            this.errors.push(
                {
                    type: 'danger',
                    msg: 'mallApp.fileUpload.error.maxFile',
                    params: { maxFile: this.maxFiles }
                }
            );
        }
        this.isValidFileExtension(files);
        return this.errors.length === 0;
    }

    private isValidFileExtension(files) {
        // Make array of file extensions
        const extensions = (this.fileExt.split(','))
                            .map(function(x) { return x.toLocaleUpperCase().trim(); });

        for (let i = 0; i < files.length; i++) {
            // Get file extension
            const ext = files[i].name.toUpperCase().split('.').pop() || files[i].name;
            // Check the extension exists
            const exists = extensions.includes(ext);
            if (!exists) {
                this.errors.push(
                    {
                        type: 'danger',
                        msg: 'mallApp.fileUpload.error.invalidFile',
                        params: { name: files[i].name }
                    }
                );
            }
            // Check file size
            this.isValidFileSize(files[i]);
        }
    }

    private isValidFileSize(file) {
        const fileSizeinMB = file.size / (1024 * 1000);
        const size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
        if (size > this.maxSize) {
            this.errors.push(
                {
                    type: 'danger',
                    msg: 'mallApp.fileUpload.error.sizeLimit',
                    params: {
                        name: file.name,
                        maxSize: this.maxFiles,
                        size
                    }
                }
            );
        }
    }
}
