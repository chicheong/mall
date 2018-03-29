import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

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
    errors: Array<string> = [];
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
        if (this.isValidFiles(event.dataTransfer.files)) {
            const urls = [];
            for (let i = 0; i < event.dataTransfer.files.length; i++) {
                var reader = new FileReader();
                reader.readAsDataURL(event.dataTransfer.files[i]);
                reader.onload = (event) => { // called once readAsDataURL is completed
//                    const url = new Url();
//                    url.entityType = Product.name;
//                    url.entityId = this.product.id;
//                    url.file = event.dataTransfer.files[i];
//                    url.path = (<FileReader>event.dataTransfer).result;
//                    urls.push(url);
                }
            }
            this.eventManager.broadcast({ name: 'filesModification', content: 'OK', obj: urls});
            this.activeModal.dismiss('OK');
        } else {
        }
    }

    onFileChange(event) {
        if (this.isValidFiles(event.target.files)) {
            const urls = [];
            for (let i = 0; i < event.target.files.length; i++) {
                var reader = new FileReader();
                reader.readAsDataURL(event.target.files[i]);
                reader.onload = (event: any) => { // called once readAsDataURL is completed
                    const url = new Url();
                    url.entityType = Product.name;
                    url.entityId = this.product.id;
                    url.file = event.target.files[i];
                    url.path = (<FileReader>event.target).result;
                    urls.push(url);
                }
            }
            this.eventManager.broadcast({ name: 'filesModification', content: 'OK', obj: urls});
            this.activeModal.dismiss('OK');
        } else {
        }
    }

    private isValidFiles(files) {
        // Check Number of files
        if (files.length <= 0) {
            this.errors.push('Error: Please upload at least one file');
        }
        if (files.length > this.maxFiles) {
            this.errors.push('Error: At a time you can upload only ' + this.maxFiles + ' files');
            return;
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
                this.errors.push('Error (Extension): ' + files[i].name);
            }
            // Check file size
            this.isValidFileSize(files[i]);
        }
    }

    private isValidFileSize(file) {
        const fileSizeinMB = file.size / (1024 * 1000);
        const size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
        if (size > this.maxSize) {
            this.errors.push('Error (File Size): ' + file.name + ': exceed file size limit of ' + this.maxSize + 'MB ( ' + size + 'MB )');
        }
    }
}
