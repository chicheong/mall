import { element, by, ElementFinder } from 'protractor';

export class PriceComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-price div table .btn-danger'));
  title = element.all(by.css('jhi-price div h2#page-heading span')).first();
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

export class PriceUpdatePage {
  pageTitle = element(by.id('jhi-price-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  fromInput = element(by.id('field_from'));
  toInput = element(by.id('field_to'));
  priceInput = element(by.id('field_price'));
  currencySelect = element(by.id('field_currency'));

  itemSelect = element(by.id('field_item'));

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

  async setPriceInput(price: string): Promise<void> {
    await this.priceInput.sendKeys(price);
  }

  async getPriceInput(): Promise<string> {
    return await this.priceInput.getAttribute('value');
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

  async itemSelectLastOption(): Promise<void> {
    await this.itemSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async itemSelectOption(option: string): Promise<void> {
    await this.itemSelect.sendKeys(option);
  }

  getItemSelect(): ElementFinder {
    return this.itemSelect;
  }

  async getItemSelectedOption(): Promise<string> {
    return await this.itemSelect.element(by.css('option:checked')).getText();
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

export class PriceDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-price-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-price'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
