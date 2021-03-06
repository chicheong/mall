import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiAlert } from 'ng-jhipster';

import { IMyUrl, MyUrl } from 'app/shared/model/my-url.model';
import { FileUploadResult } from './file-upload-result.model';

@Component({
    selector: 'jhi-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: [
        'file-upload.scss'
    ]
})
export class FileUploadComponent implements OnInit {
    errors: Array<JhiAlert> = [];
    dragAreaClass = 'dragarea';
    @Input() fileExt = 'JPG, GIF, PNG';
    @Input() maxFiles = 20;
    @Input() maxSize = 5; // 5MB
    @Input() url: IMyUrl = new MyUrl();
    @Output() result = new EventEmitter();
    @Input() displayImage = false;

    constructor(
    ) { }

    ngOnInit(): void {
        // console.error(`fileExt: ${this.fileExt}, maxFiles: ${this.maxFiles}, maxSize: ${this.maxSize}, broadcastName: ${this.broadcastName}`);
        // console.error(`this.url: ${this.url.entityType}, ${this.url.entityId}, ${this.url.sequence}`);
//        if (!this.url) {
//            this.url = new MyUrl();
//        }
    }

    @HostListener('dragover', ['$event']) onDragOver(event: any): void {
        this.dragAreaClass = 'droparea';
        event.preventDefault();
    }

    @HostListener('dragenter', ['$event']) onDragEnter(event: any): void {
        this.dragAreaClass = 'droparea';
        event.preventDefault();
    }

    @HostListener('dragend', ['$event']) onDragEnd(event: any): void {
        this.dragAreaClass = 'dragarea';
        event.preventDefault();
    }

    @HostListener('dragleave', ['$event']) onDragLeave(event: any): void {
        this.dragAreaClass = 'dragarea';
        event.preventDefault();
    }

    @HostListener('drop', ['$event']) onDrop(event: any): void {
        this.dragAreaClass = 'dragarea';
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer.files;
        if (this.isValidFiles(files)) {
            this.processFile(files);
        } else {
            const result: FileUploadResult = Object.assign(new FileUploadResult());
            result.errors = this.errors;
            result.urls = undefined;
            this.result.emit(result);
        }
    }

    onFileChange(event: any): void {
        const files = event.target.files;
        if (this.isValidFiles(files)) {
            this.processFile(files);
        } else {
            const result: FileUploadResult = Object.assign(new FileUploadResult());
            result.errors = this.errors;
            result.urls = undefined;
            this.result.emit(result);
        }
    }

    private processFile(files: any): void {
        const urls: IMyUrl[] = [];
        let counter = 0;
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            const file = files[i];
            reader.readAsDataURL(file);
            reader.onload = thisEvent => { // called once readAsDataURL is completed
                const url = new MyUrl();
                url.id = this.url.id;
                url.entityType = this.url.entityType;
                url.entityId = this.url.entityId;
                url.fileName = file.name;
                url.sequence = this.url.sequence ? (this.url.sequence + i) : 1 + i;
                console.error('url.sequence: ' + url.sequence);
                url.path = (thisEvent.target as FileReader).result as string;
                urls.push(url);
                counter++;
                if (counter === files.length) {
                    const result: FileUploadResult = Object.assign(new FileUploadResult());
                    result.errors = this.errors;
                    result.urls = urls;
                    this.result.emit(result);
                }
            };
        }
    }

    private isValidFiles(files: any): boolean {
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
                    params: { maxFiles: this.maxFiles }
                }
            );
        }
        this.isValidFileExtension(files);
        return this.errors.length === 0;
    }

    private isValidFileExtension(files: any): void {
        // Make array of file extensions
        const extensions = (this.fileExt.split(','))
                            .map(function(x): String { return x.toLocaleUpperCase().trim(); });

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

    private isValidFileSize(file: any): void {
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
