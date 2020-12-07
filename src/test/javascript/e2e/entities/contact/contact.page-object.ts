import { element, by, ElementFinder } from 'protractor';

export class ContactComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-contact div table .btn-danger'));
  title = element.all(by.css('jhi-contact div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class ContactUpdatePage {
  pageTitle = element(by.id('jhi-contact-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  nameInput = element(by.id('field_name'));
  name2Input = element(by.id('field_name2'));
  phoneNumInput = element(by.id('field_phoneNum'));
  phoneNum2Input = element(by.id('field_phoneNum2'));
  emailInput = element(by.id('field_email'));
  remarkInput = element(by.id('field_remark'));

  addressSelect = element(by.id('field_address'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getAttribute('value');
  }

  async setName2Input(name2: string): Promise<void> {
    await this.name2Input.sendKeys(name2);
  }

  async getName2Input(): Promise<string> {
    return await this.name2Input.getAttribute('value');
  }

  async setPhoneNumInput(phoneNum: string): Promise<void> {
    await this.phoneNumInput.sendKeys(phoneNum);
  }

  async getPhoneNumInput(): Promise<string> {
    return await this.phoneNumInput.getAttribute('value');
  }

  async setPhoneNum2Input(phoneNum2: string): Promise<void> {
    await this.phoneNum2Input.sendKeys(phoneNum2);
  }

  async getPhoneNum2Input(): Promise<string> {
    return await this.phoneNum2Input.getAttribute('value');
  }

  async setEmailInput(email: string): Promise<void> {
    await this.emailInput.sendKeys(email);
  }

  async getEmailInput(): Promise<string> {
    return await this.emailInput.getAttribute('value');
  }

  async setRemarkInput(remark: string): Promise<void> {
    await this.remarkInput.sendKeys(remark);
  }

  async getRemarkInput(): Promise<string> {
    return await this.remarkInput.getAttribute('value');
  }

  async addressSelectLastOption(): Promise<void> {
    await this.addressSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async addressSelectOption(option: string): Promise<void> {
    await this.addressSelect.sendKeys(option);
  }

  getAddressSelect(): ElementFinder {
    return this.addressSelect;
  }

  async getAddressSelectedOption(): Promise<string> {
    return await this.addressSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class ContactDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-contact-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-contact'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
