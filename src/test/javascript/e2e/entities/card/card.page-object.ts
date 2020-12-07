import { element, by, ElementFinder } from 'protractor';

export class CardComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-card div table .btn-danger'));
  title = element.all(by.css('jhi-card div h2#page-heading span')).first();
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

export class CardUpdatePage {
  pageTitle = element(by.id('jhi-card-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  holderNameInput = element(by.id('field_holderName'));
  cardNumberInput = element(by.id('field_cardNumber'));
  expirationMonthInput = element(by.id('field_expirationMonth'));
  expirationYearInput = element(by.id('field_expirationYear'));
  cvcInput = element(by.id('field_cvc'));

  accountSelect = element(by.id('field_account'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setHolderNameInput(holderName: string): Promise<void> {
    await this.holderNameInput.sendKeys(holderName);
  }

  async getHolderNameInput(): Promise<string> {
    return await this.holderNameInput.getAttribute('value');
  }

  async setCardNumberInput(cardNumber: string): Promise<void> {
    await this.cardNumberInput.sendKeys(cardNumber);
  }

  async getCardNumberInput(): Promise<string> {
    return await this.cardNumberInput.getAttribute('value');
  }

  async setExpirationMonthInput(expirationMonth: string): Promise<void> {
    await this.expirationMonthInput.sendKeys(expirationMonth);
  }

  async getExpirationMonthInput(): Promise<string> {
    return await this.expirationMonthInput.getAttribute('value');
  }

  async setExpirationYearInput(expirationYear: string): Promise<void> {
    await this.expirationYearInput.sendKeys(expirationYear);
  }

  async getExpirationYearInput(): Promise<string> {
    return await this.expirationYearInput.getAttribute('value');
  }

  async setCvcInput(cvc: string): Promise<void> {
    await this.cvcInput.sendKeys(cvc);
  }

  async getCvcInput(): Promise<string> {
    return await this.cvcInput.getAttribute('value');
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

export class CardDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-card-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-card'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
