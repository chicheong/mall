import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JhiLanguageService } from 'ng-jhipster';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { LANGUAGES } from 'app/core/language/language.constants';

import { ShopService } from 'app/entities/shop/shop.service';
import { Shop, IShop } from "app/shared/model/shop.model";
import { IMyUrl, MyUrl } from "app/shared/model/my-url.model";
import { Observable } from "rxjs";
import { HttpResponse } from "@angular/common/http";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FileUploadDialogComponent } from "app/shared/file-upload/file-upload-dialog.component";
import { MyUrlService } from "app/entities/my-url/my-url.service";

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  account: Account;
  success = false;
  languages = LANGUAGES;
  settingsForm = this.fb.group({
    firstName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    lastName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    email: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    langKey: [undefined]
  });
  
  isSavingBasic = false;
  isEditingBasic = false;

  constructor(
          private accountService: AccountService, 
          private fb: FormBuilder, 
          protected modalService: NgbModal,
          private languageService: JhiLanguageService,
          private shopService: ShopService,
          private urlService: MyUrlService
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.settingsForm.patchValue({
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          langKey: account.langKey
        });

        this.account = account;
      }
    });
  }

  saveBasic(): void {
    this.success = false;

    this.account.firstName = this.settingsForm.get('firstName')!.value;
    this.account.lastName = this.settingsForm.get('lastName')!.value;
    this.account.email = this.settingsForm.get('email')!.value;
    this.account.langKey = this.settingsForm.get('langKey')!.value;

    this.accountService.save(this.account).subscribe(() => {
      this.success = true;

      this.accountService.authenticate(this.account);

      if (this.account.langKey !== this.languageService.getCurrentLanguage()) {
        this.languageService.changeLanguage(this.account.langKey);
      }
      this.isSavingBasic = false;
      this.isEditingBasic = false;
    });
  }

  editBasic(): void {
      this.isEditingBasic = true;
  }
  
  cancelBasic(): void {
      this.isEditingBasic = false;
      this.accountService.identity().subscribe(account => {
          if (account) {
            this.settingsForm.patchValue({
              firstName: account.firstName,
              lastName: account.lastName,
              email: account.email,
              langKey: account.langKey
            });

            this.account = account;
          }
     });
  }

  createMyShop(): void {
//      console.log('createMyShop');
      const shop: IShop = Object.assign(new Shop());
      shop.code = 'temp';
      
      this.subscribeToSaveResponse(this.shopService.create(shop));
  }
  
    protected subscribeToSaveResponse(result: Observable<HttpResponse<IShop>>): void {
      result.subscribe(
        () => this.onSaveSuccess(),
        () => this.onSaveError()
      );
    }

    protected onSaveSuccess(): void {
//      this.isSaving = false;
//      this.previousState();
    }
    
    protected onSaveError(): void {
//      this.isSaving = false;
    }

  /**
  copyAccount(account): Account {
      return {
          activated: account.activated,
          email: account.email,
          firstName: account.firstName,
          langKey: account.langKey,
          lastName: account.lastName,
          login: account.login,
          imageUrl: account.imageUrl
      };
  }
  */

  updateUserImage(urls: IMyUrl[]): void {
      if (urls[0] && urls[0].path) {
          this.account.imageUrl = urls[0].path;
      }
          
  }

  updateUserFile(urls: IMyUrl[]): void {
      this.subscribeToSaveMultipleResponse(this.urlService.createMultiple(urls));
  }
  
  protected subscribeToSaveMultipleResponse(result: Observable<HttpResponse<IMyUrl[]>>): void {
      result.subscribe(
        () => this.onSaveSuccess(),
        () => this.onSaveError()
      );
  }

  uploadUserImage(): void {
//      this.modalRef = this.uploadMediaModelService.open(null, null, 1, null, SettingsComponentUploadType.USER_IMAGE);
      const modalRef: NgbModalRef = this.modalService.open(FileUploadDialogComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.object = null;
      modalRef.componentInstance.maxFiles = 1;
      modalRef.result.then((result) => {
          if (result) {
              console.error('settings->uploadUserImage->result: ' + result);
              this.updateUserImage(result);
          }
      }).catch(() => {});
  }

  uploadFile(): void {
      const url = new MyUrl();
      url.entityType = 'User';
      url.entityId = 1;
      url.sequence = 1;
      
      const modalRef: NgbModalRef = this.modalService.open(FileUploadDialogComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.object = url;
      modalRef.result.then((result) => {
          if (result) {
              console.error('settings->uploadFile->result: ' + result);
              this.updateUserFile(result);
          }
      }).catch(() => {});
  }
}
