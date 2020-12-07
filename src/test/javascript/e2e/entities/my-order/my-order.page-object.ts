import { element, by, ElementFinder } from 'protractor';

export class MyOrderComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-my-order div table .btn-danger'));
  title = element.all(by.css('jhi-my-order div h2#page-heading span')).first();
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

export class MyOrderUpdatePage {
  pageTitle = element(by.id('jhi-my-order-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  totalInput = element(by.id('field_total'));
  currencySelect = element(by.id('field_currency'));
  remarkInput = element(by.id('field_remark'));
  statusSelect = element(by.id('field_status'));

  shippingSelect = element(by.id('field_shipping'));
  billingSelect = element(by.id('field_billing'));
  accountSelect = element(by.id('field_account'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setTotalInput(total: string): Promise<void> {
    await this.totalInput.sendKeys(total);
  }

  async getTotalInput(): Promise<string> {
    return await this.totalInput.getAttribute('value');
  }

  async setCurrencySelect(currency: string): Promise<void> {
    await this.currencySelect.sendKeys(currency);
  }

  async getCurrencySelect(): Promise<string> {
    return await this.currencySelect.element(by.css('option:checked')).getText();
  }

  async currencySelectLastOption(): Promise<void> {
    await this.currencySelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async setRemarkInput(remark: string): Promise<void> {
    await this.remarkInput.sendKeys(remark);
  }

  async getRemarkInput(): Promise<string> {
    return await this.remarkInput.getAttribute('value');
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

  async shippingSelectLastOption(): Promise<void> {
    await this.shippingSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async shippingSelectOption(option: string): Promise<void> {
    await this.shippingSelect.sendKeys(option);
  }

  getShippingSelect(): ElementFinder {
    return this.shippingSelect;
  }

  async getShippingSelectedOption(): Promise<string> {
    return await this.shippingSelect.element(by.css('option:checked')).getText();
  }

  async billingSelectLastOption(): Promise<void> {
    await this.billingSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async billingSelectOption(option: string): Promise<void> {
    await this.billingSelect.sendKeys(option);
  }

  getBillingSelect(): ElementFinder {
    return this.billingSelect;
  }

  async getBillingSelectedOption(): Promise<string> {
    return await this.billingSelect.element(by.css('option:checked')).getText();
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

export class MyOrderDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-myOrder-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-myOrder'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
