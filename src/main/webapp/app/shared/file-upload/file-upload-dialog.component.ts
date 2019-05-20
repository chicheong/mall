import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiAlert } from 'ng-jhipster';

import { Url } from '../../entities/url';
import { FileUploadResult } from './file-upload.component';

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
    fileExt = 'JPG, GIF, PNG';
    maxFiles = 20;
    maxSize = 5; // 5MB
    broadcastName = 'filesModification';
    // @Output() uploadStatus = new EventEmitter();

    url: Url;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
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
        if (!(result.errors)) {
          this.eventManager.broadcast({ name: this.broadcastName, content: 'OK', obj: result.urls});
          this.activeModal.dismiss('OK');
        } else {
          result.errors.forEach((error) => {
              this.jhiAlertService.error(error.msg, error.params, null);
          });
        }
    }
}
