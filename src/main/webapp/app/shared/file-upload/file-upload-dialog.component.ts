import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiAlert } from 'ng-jhipster';

import { IUrl, Url } from 'app/shared/model/url.model';
import { FileUploadResult } from './file-upload-result.model';

@Component({
    selector: 'jhi-file-upload-dialog',
    templateUrl: './file-upload-dialog.component.html',
    styleUrls: [
        'file-upload.scss'
    ]
})
export class FileUploadDialogComponent implements OnInit {
    fileExt = 'JPG, GIF, PNG';
    maxFiles = 20;
    maxSize = 5; // 5MB
    broadcastName: string;
    // @Output() uploadStatus = new EventEmitter();

    url: IUrl;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        // console.error(`fileExt: ${this.fileExt}, maxFiles: ${this.maxFiles}, maxSize: ${this.maxSize}, broadcastName: ${this.broadcastName}`);
        // console.error(`Dialog this.url: ${this.url.entityType}, ${this.url.entityId}, ${this.url.sequence}`);
        if (!this.url) {
            this.url = new Url();
        }
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    ok() {
        this.activeModal.dismiss('OK');
    }

    getResult(result: FileUploadResult) {
        if (result.errors === undefined || result.errors.length === 0) {
          this.eventManager.broadcast({ name: this.broadcastName, content: 'OK', obj: result.urls});
          this.activeModal.dismiss('OK');
        } else {
          result.errors.forEach(error => {
              this.jhiAlertService.error(error.msg, error.params, null);
          });
        }
    }
}
