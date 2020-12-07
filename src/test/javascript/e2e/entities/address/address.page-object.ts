import { element, by, ElementFinder } from 'protractor';

export class AddressComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-address div table .btn-danger'));
  title = element.all(by.css('jhi-address div h2#page-heading span')).first();
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

export class AddressUpdatePage {
  pageTitle = element(by.id('jhi-address-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  line1Input = element(by.id('field_line1'));
  line2Input = element(by.id('field_line2'));
  line3Input = element(by.id('field_line3'));
  line4Input = element(by.id('field_line4'));
  cityInput = element(by.id('field_city'));
  postalCodeInput = element(by.id('field_postalCode'));

  countrySelect = element(by.id('field_country'));
  myStateSelect = element(by.id('field_myState'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setLine1Input(line1: string): Promise<void> {
    await this.line1Input.sendKeys(line1);
  }

  async getLine1Input(): Promise<string> {
    return await this.line1Input.getAttribute('value');
  }

  async setLine2Input(line2: string): Promise<void> {
    await this.line2Input.sendKeys(line2);
  }

  async getLine2Input(): Promise<string> {
    return await this.line2Input.getAttribute('value');
  }

  async setLine3Input(line3: string): Promise<void> {
    await this.line3Input.sendKeys(line3);
  }

  async getLine3Input(): Promise<string> {
    return await this.line3Input.getAttribute('value');
  }

  async setLine4Input(line4: string): Promise<void> {
    await this.line4Input.sendKeys(line4);
  }

  async getLine4Input(): Promise<string> {
    return await this.line4Input.getAttribute('value');
  }

  async setCityInput(city: string): Promise<void> {
    await this.cityInput.sendKeys(city);
  }

  async getCityInput(): Promise<string> {
    return await this.cityInput.getAttribute('value');
  }

  async setPostalCodeInput(postalCode: string): Promise<void> {
    await this.postalCodeInput.sendKeys(postalCode);
  }

  async getPostalCodeInput(): Promise<string> {
    return await this.postalCodeInput.getAttribute('value');
  }

  async countrySelectLastOption(): Promise<void> {
    await this.countrySelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async countrySelectOption(option: string): Promise<void> {
    await this.countrySelect.sendKeys(option);
  }

  getCountrySelect(): ElementFinder {
    return this.countrySelect;
  }

  async getCountrySelectedOption(): Promise<string> {
    return await this.countrySelect.element(by.css('option:checked')).getText();
  }

  async myStateSelectLastOption(): Promise<void> {
    await this.myStateSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async myStateSelectOption(option: string): Promise<void> {
    await this.myStateSelect.sendKeys(option);
  }

  getMyStateSelect(): ElementFinder {
    return this.myStateSelect;
  }

  async getMyStateSelectedOption(): Promise<string> {
    return await this.myStateSelect.element(by.css('option:checked')).getText();
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

export class AddressDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-address-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-address'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
