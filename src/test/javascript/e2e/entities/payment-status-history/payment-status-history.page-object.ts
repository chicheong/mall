import { element, by, ElementFinder } from 'protractor';

export class PaymentStatusHistoryComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-payment-status-history div table .btn-danger'));
  title = element.all(by.css('jhi-payment-status-history div h2#page-heading span')).first();
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

export class PaymentStatusHistoryUpdatePage {
  pageTitle = element(by.id('jhi-payment-status-history-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  effectiveDateInput = element(by.id('field_effectiveDate'));
  statusSelect = element(by.id('field_status'));

  paymentSelect = element(by.id('field_payment'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setEffectiveDateInput(effectiveDate: string): Promise<void> {
    await this.effectiveDateInput.sendKeys(effectiveDate);
  }

  async getEffectiveDateInput(): Promise<string> {
    return await this.effectiveDateInput.getAttribute('value');
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

  async paymentSelectLastOption(): Promise<void> {
    await this.paymentSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async paymentSelectOption(option: string): Promise<void> {
    await this.paymentSelect.sendKeys(option);
  }

  getPaymentSelect(): ElementFinder {
    return this.paymentSelect;
  }

  async getPaymentSelectedOption(): Promise<string> {
    return await this.paymentSelect.element(by.css('option:checked')).getText();
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

export class PaymentStatusHistoryDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-paymentStatusHistory-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-paymentStatusHistory'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
