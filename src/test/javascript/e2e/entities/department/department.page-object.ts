import { element, by, ElementFinder } from 'protractor';

export class DepartmentComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-department div table .btn-danger'));
  title = element.all(by.css('jhi-department div h2#page-heading span')).first();
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

export class DepartmentUpdatePage {
  pageTitle = element(by.id('jhi-department-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  codeInput = element(by.id('field_code'));
  nameInput = element(by.id('field_name'));
  statusSelect = element(by.id('field_status'));

  parentSelect = element(by.id('field_parent'));
  officeSelect = element(by.id('field_office'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setCodeInput(code: string): Promise<void> {
    await this.codeInput.sendKeys(code);
  }

  async getCodeInput(): Promise<string> {
    return await this.codeInput.getAttribute('value');
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getAttribute('value');
  }

  async setStatusSelect(status: string): Promise<void> {
    await this.statusSelect.sendKeys(status);
  }

  async getStatusSelect(): Promise<string> {
    return await this.statusSelect.element(by.css('option:checked')).getText();
  }

  async statusSelectLastOption(): Promise<void> {
    await this.statusSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async parentSelectLastOption(): Promise<void> {
    await this.parentSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async parentSelectOption(option: string): Promise<void> {
    await this.parentSelect.sendKeys(option);
  }

  getParentSelect(): ElementFinder {
    return this.parentSelect;
  }

  async getParentSelectedOption(): Promise<string> {
    return await this.parentSelect.element(by.css('option:checked')).getText();
  }

  async officeSelectLastOption(): Promise<void> {
    await this.officeSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async officeSelectOption(option: string): Promise<void> {
    await this.officeSelect.sendKeys(option);
  }

  getOfficeSelect(): ElementFinder {
    return this.officeSelect;
  }

  async getOfficeSelectedOption(): Promise<string> {
    return await this.officeSelect.element(by.css('option:checked')).getText();
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

export class DepartmentDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-department-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-department'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
