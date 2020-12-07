import { element, by, ElementFinder } from 'protractor';

export class ProductItemComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-product-item div table .btn-danger'));
  title = element.all(by.css('jhi-product-item div h2#page-heading span')).first();
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

export class ProductItemUpdatePage {
  pageTitle = element(by.id('jhi-product-item-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  codeInput = element(by.id('field_code'));
  isDefaultInput = element(by.id('field_isDefault'));
  quantityInput = element(by.id('field_quantity'));
  currencySelect = element(by.id('field_currency'));
  priceInput = element(by.id('field_price'));

  colorSelect = element(by.id('field_color'));
  sizeSelect = element(by.id('field_size'));
  productSelect = element(by.id('field_product'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setCodeInput(code: string): Promise<void> {
    await this.codeInput.sendKeys(code);
  }

  async getCodeInput(): Promise<string> {
    return await this.codeInput.getAttribute('value');
  }

  getIsDefaultInput(): ElementFinder {
    return this.isDefaultInput;
  }

  async setQuantityInput(quantity: string): Promise<void> {
    await this.quantityInput.sendKeys(quantity);
  }

  async getQuantityInput(): Promise<string> {
    return await this.quantityInput.getAttribute('value');
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

  async setPriceInput(price: string): Promise<void> {
    await this.priceInput.sendKeys(price);
  }

  async getPriceInput(): Promise<string> {
    return await this.priceInput.getAttribute('value');
  }

  async colorSelectLastOption(): Promise<void> {
    await this.colorSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async colorSelectOption(option: string): Promise<void> {
    await this.colorSelect.sendKeys(option);
  }

  getColorSelect(): ElementFinder {
    return this.colorSelect;
  }

  async getColorSelectedOption(): Promise<string> {
    return await this.colorSelect.element(by.css('option:checked')).getText();
  }

  async sizeSelectLastOption(): Promise<void> {
    await this.sizeSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async sizeSelectOption(option: string): Promise<void> {
    await this.sizeSelect.sendKeys(option);
  }

  getSizeSelect(): ElementFinder {
    return this.sizeSelect;
  }

  async getSizeSelectedOption(): Promise<string> {
    return await this.sizeSelect.element(by.css('option:checked')).getText();
  }

  async productSelectLastOption(): Promise<void> {
    await this.productSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async productSelectOption(option: string): Promise<void> {
    await this.productSelect.sendKeys(option);
  }

  getProductSelect(): ElementFinder {
    return this.productSelect;
  }

  async getProductSelectedOption(): Promise<string> {
    return await this.productSelect.element(by.css('option:checked')).getText();
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

export class ProductItemDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-productItem-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-productItem'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
