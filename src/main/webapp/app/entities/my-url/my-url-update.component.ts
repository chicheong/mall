import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IMyUrl, MyUrl } from 'app/shared/model/my-url.model';
import { MyUrlService } from './my-url.service';

@Component({
  selector: 'jhi-url-update',
  templateUrl: './my-url-update.component.html'
})
export class MyUrlUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    entityType: [],
    entityId: [],
    path: [],
    fileName: [],
    sequence: [],
    description: [],
    createdBy: [],
    createdDate: [],
    lastModifiedBy: [],
    lastModifiedDate: []
  });

  constructor(protected urlService: MyUrlService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ url }) => {
      if (!url.id) {
        const today = moment().startOf('day');
        url.createdDate = today;
        url.lastModifiedDate = today;
      }

      this.updateForm(url);
    });
  }

  updateForm(url: IMyUrl): void {
    this.editForm.patchValue({
      id: url.id,
      entityType: url.entityType,
      entityId: url.entityId,
      path: url.path,
      fileName: url.fileName,
      sequence: url.sequence,
      description: url.description,
      createdBy: url.createdBy,
      createdDate: url.createdDate ? url.createdDate.format(DATE_TIME_FORMAT) : null,
      lastModifiedBy: url.lastModifiedBy,
      lastModifiedDate: url.lastModifiedDate ? url.lastModifiedDate.format(DATE_TIME_FORMAT) : null
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const url = this.createFromForm();
    if (url.id !== undefined) {
      this.subscribeToSaveResponse(this.urlService.update(url));
    } else {
      this.subscribeToSaveResponse(this.urlService.create(url));
    }
  }

  private createFromForm(): IMyUrl {
    return {
      ...new MyUrl(),
      id: this.editForm.get(['id'])!.value,
      entityType: this.editForm.get(['entityType'])!.value,
      entityId: this.editForm.get(['entityId'])!.value,
      path: this.editForm.get(['path'])!.value,
      fileName: this.editForm.get(['fileName'])!.value,
      sequence: this.editForm.get(['sequence'])!.value,
      description: this.editForm.get(['description'])!.value,
      createdBy: this.editForm.get(['createdBy'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value
        ? moment(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      lastModifiedBy: this.editForm.get(['lastModifiedBy'])!.value,
      lastModifiedDate: this.editForm.get(['lastModifiedDate'])!.value
        ? moment(this.editForm.get(['lastModifiedDate'])!.value, DATE_TIME_FORMAT)
        : undefined
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMyUrl>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
