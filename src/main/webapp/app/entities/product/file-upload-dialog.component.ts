import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ProductItemsDialogType } from './product-items-dialog.component';

import { Product } from './product.model';

import { UuidService } from '../../shared';

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
    @Input() entityType: string;
    @Input() entityId: number;
    @Input() fileExt = 'JPG, GIF, PNG';
    @Input() maxFiles = 5;
    @Input() maxSize = 5; // 5MB
    // @Output() uploadStatus = new EventEmitter();

    product: Product;
    fileToUpload: FileList;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private uuidService: UuidService
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

    onFileChange(event) {
        const files = event.target.files;
        console.error('event: ' + event);
        console.error('event.target: ' + event.target);
        
        let evilResponseProps = Object.keys(event.target);
        // Step 2. Create an empty array.
        // Step 3. Iterate throw all keys.
        evilResponseProps.forEach((prop) => 
            console.error(event.target[prop]));
        
        this.returnFiles(files);
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
        this.returnFiles(files);
    }

    returnFiles(files) {
        this.errors = []; // Clear error
        // Validate file size and allowed extensions
        if (files.length > 0 && (!this.isValidFiles(files))) {
            // this.uploadStatus.emit(false);
            return;
        }

        if (files.length > 0) {
            const formData: FormData = new FormData();
            for (let j = 0; j < files.length; j++) {
                formData.append('file[]', files[j], files[j].name);
            }
            const parameters = {
                entityType: this.entityType,
                entityId: this.entityId
            };
//            this.fileService.upload(formData, parameters)
//                .subscribe(
//                success => {
//                  this.uploadStatus.emit(true);
//                  console.log(success)
//                },
//                error => {
//                    this.uploadStatus.emit(true);
//                    this.errors.push(error.ExceptionMessage);
//                })

//          this.productItem.prices = this.prices;
            this.eventManager.broadcast({ name: 'filesModification', content: 'OK', obj: files});
            this.activeModal.dismiss('OK');
        }
    }

    private isValidFiles(files) {
        // Check Number of files
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
