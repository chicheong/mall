import { element, by, ElementFinder } from 'protractor';

export class OrderShopComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-order-shop div table .btn-danger'));
  title = element.all(by.css('jhi-order-shop div h2#page-heading span')).first();
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

export class OrderShopUpdatePage {
  pageTitle = element(by.id('jhi-order-shop-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  totalInput = element(by.id('field_total'));
  currencySelect = element(by.id('field_currency'));
  remarkInput = element(by.id('field_remark'));

  shippingSelect = element(by.id('field_shipping'));
  shopSelect = element(by.id('field_shop'));
  orderSelect = element(by.id('field_order'));

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

  async shopSelectLastOption(): Promise<void> {
    await this.shopSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async shopSelectOption(option: string): Promise<void> {
    await this.shopSelect.sendKeys(option);
  }

  getShopSelect(): ElementFinder {
    return this.shopSelect;
  }

  async getShopSelectedOption(): Promise<string> {
    return await this.shopSelect.element(by.css('option:checked')).getText();
  }

  async orderSelectLastOption(): Promise<void> {
    await this.orderSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async orderSelectOption(option: string): Promise<void> {
    await this.orderSelect.sendKeys(option);
  }

  getOrderSelect(): ElementFinder {
    return this.orderSelect;
  }

  async getOrderSelectedOption(): Promise<string> {
    return await this.orderSelect.element(by.css('option:checked')).getText();
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

export class OrderShopDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-orderShop-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-orderShop'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
