import { element, by, ElementFinder } from 'protractor';

export class CurrencyRateComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-currency-rate div table .btn-danger'));
  title = element.all(by.css('jhi-currency-rate div h2#page-heading span')).first();
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

export class CurrencyRateUpdatePage {
  pageTitle = element(by.id('jhi-currency-rate-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  fromInput = element(by.id('field_from'));
  toInput = element(by.id('field_to'));
  rateInput = element(by.id('field_rate'));
  sourceCurrencySelect = element(by.id('field_sourceCurrency'));
  targetCurrencySelect = element(by.id('field_targetCurrency'));

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

  async setRateInput(rate: string): Promise<void> {
    await this.rateInput.sendKeys(rate);
  }

  async getRateInput(): Promise<string> {
    return await this.rateInput.getAttribute('value');
  }

  async setSourceCurrencySelect(sourceCurrency: string): Promise<void> {
    await this.sourceCurrencySelect.sendKeys(sourceCurrency);
  }

  async getSourceCurrencySelect(): Promise<string> {
    return await this.sourceCurrencySelect.element(by.css('option:checked')).getText();
  }

  async sourceCurrencySelectLastOption(): Promise<void> {
    await this.sourceCurrencySelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async setTargetCurrencySelect(targetCurrency: string): Promise<void> {
    await this.targetCurrencySelect.sendKeys(targetCurrency);
  }

  async getTargetCurrencySelect(): Promise<string> {
    return await this.targetCurrencySelect.element(by.css('option:checked')).getText();
  }

  async targetCurrencySelectLastOption(): Promise<void> {
    await this.targetCurrencySelect
      .all(by.tagName('option'))
      .last()
      .click();
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

export class CurrencyRateDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-currencyRate-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-currencyRate'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
