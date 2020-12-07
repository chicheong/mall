import { element, by, ElementFinder } from 'protractor';

export class UserInfoComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-user-info div table .btn-danger'));
  title = element.all(by.css('jhi-user-info div h2#page-heading span')).first();
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

export class UserInfoUpdatePage {
  pageTitle = element(by.id('jhi-user-info-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  accountIdInput = element(by.id('field_accountId'));
  shopIdInput = element(by.id('field_shopId'));

  userSelect = element(by.id('field_user'));
  defaultAccountSelect = element(by.id('field_defaultAccount'));
  accountSelect = element(by.id('field_account'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setAccountIdInput(accountId: string): Promise<void> {
    await this.accountIdInput.sendKeys(accountId);
  }

  async getAccountIdInput(): Promise<string> {
    return await this.accountIdInput.getAttribute('value');
  }

  async setShopIdInput(shopId: string): Promise<void> {
    await this.shopIdInput.sendKeys(shopId);
  }

  async getShopIdInput(): Promise<string> {
    return await this.shopIdInput.getAttribute('value');
  }

  async userSelectLastOption(): Promise<void> {
    await this.userSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async userSelectOption(option: string): Promise<void> {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect(): ElementFinder {
    return this.userSelect;
  }

  async getUserSelectedOption(): Promise<string> {
    return await this.userSelect.element(by.css('option:checked')).getText();
  }

  async defaultAccountSelectLastOption(): Promise<void> {
    await this.defaultAccountSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async defaultAccountSelectOption(option: string): Promise<void> {
    await this.defaultAccountSelect.sendKeys(option);
  }

  getDefaultAccountSelect(): ElementFinder {
    return this.defaultAccountSelect;
  }

  async getDefaultAccountSelectedOption(): Promise<string> {
    return await this.defaultAccountSelect.element(by.css('option:checked')).getText();
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

export class UserInfoDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-userInfo-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-userInfo'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
