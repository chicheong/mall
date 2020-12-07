import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IContact, Contact } from 'app/shared/model/contact.model';
import { ContactService } from './contact.service';
import { IAddress } from 'app/shared/model/address.model';
import { AddressService } from 'app/entities/address/address.service';

@Component({
  selector: 'jhi-contact-update',
  templateUrl: './contact-update.component.html'
})
export class ContactUpdateComponent implements OnInit {
  isSaving = false;
  addresses: IAddress[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    name2: [],
    phoneNum: [],
    phoneNum2: [],
    email: [],
    remark: [],
    address: []
  });

  constructor(
    protected contactService: ContactService,
    protected addressService: AddressService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contact }) => {
      this.updateForm(contact);

      this.addressService
        .query({ filter: 'contact-is-null' })
        .pipe(
          map((res: HttpResponse<IAddress[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IAddress[]) => {
          if (!contact.addressId) {
            this.addresses = resBody;
          } else {
            this.addressService
              .find(contact.addressId)
              .pipe(
                map((subRes: HttpResponse<IAddress>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IAddress[]) => (this.addresses = concatRes));
          }
        });
    });
  }

  updateForm(contact: IContact): void {
    this.editForm.patchValue({
      id: contact.id,
      name: contact.name,
      name2: contact.name2,
      phoneNum: contact.phoneNum,
      phoneNum2: contact.phoneNum2,
      email: contact.email,
      remark: contact.remark,
      address: contact.address
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const contact = this.createFromForm();
    if (contact.id !== undefined) {
      this.subscribeToSaveResponse(this.contactService.update(contact));
    } else {
      this.subscribeToSaveResponse(this.contactService.create(contact));
    }
  }

  private createFromForm(): IContact {
    return {
      ...new Contact(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      name2: this.editForm.get(['name2'])!.value,
      phoneNum: this.editForm.get(['phoneNum'])!.value,
      phoneNum2: this.editForm.get(['phoneNum2'])!.value,
      email: this.editForm.get(['email'])!.value,
      remark: this.editForm.get(['remark'])!.value,
      address: this.editForm.get(['address'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContact>>): void {
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

  trackById(index: number, item: IAddress): any {
    return item.id;
  }
}
