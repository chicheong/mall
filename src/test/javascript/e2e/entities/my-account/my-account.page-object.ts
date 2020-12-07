import { element, by, ElementFinder } from 'protractor';

export class MyAccountComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-my-account div table .btn-danger'));
  title = element.all(by.css('jhi-my-account div h2#page-heading span')).first();
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

export class MyAccountUpdatePage {
  pageTitle = element(by.id('jhi-my-account-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  balanceInput = element(by.id('field_balance'));
  typeSelect = element(by.id('field_type'));

  companySelect = element(by.id('field_company'));
  departmentSelect = element(by.id('field_department'));
  officeSelect = element(by.id('field_office'));
  shopSelect = element(by.id('field_shop'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setBalanceInput(balance: string): Promise<void> {
    await this.balanceInput.sendKeys(balance);
  }

  async getBalanceInput(): Promise<string> {
    return await this.balanceInput.getAttribute('value');
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

  async companySelectLastOption(): Promise<void> {
    await this.companySelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async companySelectOption(option: string): Promise<void> {
    await this.companySelect.sendKeys(option);
  }

  getCompanySelect(): ElementFinder {
    return this.companySelect;
  }

  async getCompanySelectedOption(): Promise<string> {
    return await this.companySelect.element(by.css('option:checked')).getText();
  }

  async departmentSelectLastOption(): Promise<void> {
    await this.departmentSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async departmentSelectOption(option: string): Promise<void> {
    await this.departmentSelect.sendKeys(option);
  }

  getDepartmentSelect(): ElementFinder {
    return this.departmentSelect;
  }

  async getDepartmentSelectedOption(): Promise<string> {
    return await this.departmentSelect.element(by.css('option:checked')).getText();
  }

  async officeSelectLastOption(): Promise<void> {
    await this.officeSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async officeSelectOption(option: string): Promise<void> {
    await this.officeSelect.sendKeys(option);
  }

  getOfficeSelect(): ElementFinder {
    return this.officeSelect;
  }

  async getOfficeSelectedOption(): Promise<string> {
    return await this.officeSelect.element(by.css('option:checked')).getText();
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

export class MyAccountDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-myAccount-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-myAccount'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
