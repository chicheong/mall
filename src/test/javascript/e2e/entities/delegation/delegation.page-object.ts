import { element, by, ElementFinder } from 'protractor';

export class DelegationComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-delegation div table .btn-danger'));
  title = element.all(by.css('jhi-delegation div h2#page-heading span')).first();
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

export class DelegationUpdatePage {
  pageTitle = element(by.id('jhi-delegation-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  fromInput = element(by.id('field_from'));
  toInput = element(by.id('field_to'));
  typeSelect = element(by.id('field_type'));
  delegateIdInput = element(by.id('field_delegateId'));
  statusSelect = element(by.id('field_status'));
  createdByInput = element(by.id('field_createdBy'));
  createdDateInput = element(by.id('field_createdDate'));
  lastModifiedByInput = element(by.id('field_lastModifiedBy'));
  lastModifiedDateInput = element(by.id('field_lastModifiedDate'));

  accountSelect = element(by.id('field_account'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setFromInput(from: string): Promise<void> {
    await this.fromInput.sendKeys(from);
  }

  async getFromInput(): Promise<string> {
    return await this.fromInput.getAttribute('value');
  }

  async setToInput(to: string): Promise<void> {
    await this.toInput.sendKeys(to);
  }

  async getToInput(): Promise<string> {
    return await this.toInput.getAttribute('value');
  }

  async setTypeSelect(type: string): Promise<void> {
    await this.typeSelect.sendKeys(type);
  }

  async getTypeSelect(): Promise<string> {
    return await this.typeSelect.element(by.css('option:checked')).getText();
  }

  async typeSelectLastOption(): Promise<void> {
    await this.typeSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async setDelegateIdInput(delegateId: string): Promise<void> {
    await this.delegateIdInput.sendKeys(delegateId);
  }

  async getDelegateIdInput(): Promise<string> {
    return await this.delegateIdInput.getAttribute('value');
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

  async setCreatedByInput(createdBy: string): Promise<void> {
    await this.createdByInput.sendKeys(createdBy);
  }

  async getCreatedByInput(): Promise<string> {
    return await this.createdByInput.getAttribute('value');
  }

  async setCreatedDateInput(createdDate: string): Promise<void> {
    await this.createdDateInput.sendKeys(createdDate);
  }

  async getCreatedDateInput(): Promise<string> {
    return await this.createdDateInput.getAttribute('value');
  }

  async setLastModifiedByInput(lastModifiedBy: string): Promise<void> {
    await this.lastModifiedByInput.sendKeys(lastModifiedBy);
  }

  async getLastModifiedByInput(): Promise<string> {
    return await this.lastModifiedByInput.getAttribute('value');
  }

  async setLastModifiedDateInput(lastModifiedDate: string): Promise<void> {
    await this.lastModifiedDateInput.sendKeys(lastModifiedDate);
  }

  async getLastModifiedDateInput(): Promise<string> {
    return await this.lastModifiedDateInput.getAttribute('value');
  }

  async accountSelectLastOption(): Promise<void> {
    await this.accountSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async accountSelectOption(option: string): Promise<void> {
    await this.accountSelect.sendKeys(option);
  }

  getAccountSelect(): ElementFinder {
    return this.accountSelect;
  }

  async getAccountSelectedOption(): Promise<string> {
    return await this.accountSelect.element(by.css('option:checked')).getText();
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

export class DelegationDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-delegation-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-delegation'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
