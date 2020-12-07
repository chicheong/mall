import { element, by, ElementFinder } from 'protractor';

export class ShippingPriceRuleComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-shipping-price-rule div table .btn-danger'));
  title = element.all(by.css('jhi-shipping-price-rule div h2#page-heading span')).first();
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

export class ShippingPriceRuleUpdatePage {
  pageTitle = element(by.id('jhi-shipping-price-rule-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  typeSelect = element(by.id('field_type'));
  valueInput = element(by.id('field_value'));
  priceInput = element(by.id('field_price'));
  sequenceInput = element(by.id('field_sequence'));

  shopSelect = element(by.id('field_shop'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
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

  async setValueInput(value: string): Promise<void> {
    await this.valueInput.sendKeys(value);
  }

  async getValueInput(): Promise<string> {
    return await this.valueInput.getAttribute('value');
  }

  async setPriceInput(price: string): Promise<void> {
    await this.priceInput.sendKeys(price);
  }

  async getPriceInput(): Promise<string> {
    return await this.priceInput.getAttribute('value');
  }

  async setSequenceInput(sequence: string): Promise<void> {
    await this.sequenceInput.sendKeys(sequence);
  }

  async getSequenceInput(): Promise<string> {
    return await this.sequenceInput.getAttribute('value');
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

export class ShippingPriceRuleDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-shippingPriceRule-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-shippingPriceRule'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
