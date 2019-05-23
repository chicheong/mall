import { element, by, ElementFinder } from 'protractor';

export class UserInfoComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-user-info div table .btn-danger'));
    title = element.all(by.css('jhi-user-info div h2#page-heading span')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async clickOnLastDeleteButton() {
        await this.deleteButtons.last().click();
    }

    async countDeleteButtons() {
        return this.deleteButtons.count();
    }

    async getTitle() {
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

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setAccountIdInput(accountId) {
        await this.accountIdInput.sendKeys(accountId);
    }

    async getAccountIdInput() {
        return this.accountIdInput.getAttribute('value');
    }

    async setShopIdInput(shopId) {
        await this.shopIdInput.sendKeys(shopId);
    }

    async getShopIdInput() {
        return this.shopIdInput.getAttribute('value');
    }

    async userSelectLastOption() {
        await this.userSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async userSelectOption(option) {
        await this.userSelect.sendKeys(option);
    }

    getUserSelect(): ElementFinder {
        return this.userSelect;
    }

    async getUserSelectedOption() {
        return this.userSelect.element(by.css('option:checked')).getText();
    }

    async defaultAccountSelectLastOption() {
        await this.defaultAccountSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async defaultAccountSelectOption(option) {
        await this.defaultAccountSelect.sendKeys(option);
    }

    getDefaultAccountSelect(): ElementFinder {
        return this.defaultAccountSelect;
    }

    async getDefaultAccountSelectedOption() {
        return this.defaultAccountSelect.element(by.css('option:checked')).getText();
    }

    async accountSelectLastOption() {
        await this.accountSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async accountSelectOption(option) {
        await this.accountSelect.sendKeys(option);
    }

    getAccountSelect(): ElementFinder {
        return this.accountSelect;
    }

    async getAccountSelectedOption() {
        return this.accountSelect.element(by.css('option:checked')).getText();
    }

    async save() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}

export class UserInfoDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-userInfo-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-userInfo'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
