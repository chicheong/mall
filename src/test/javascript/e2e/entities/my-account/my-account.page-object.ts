import { element, by, ElementFinder } from 'protractor';

export class MyAccountComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-my-account div table .btn-danger'));
    title = element.all(by.css('jhi-my-account div h2#page-heading span')).first();

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

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setBalanceInput(balance) {
        await this.balanceInput.sendKeys(balance);
    }

    async getBalanceInput() {
        return this.balanceInput.getAttribute('value');
    }

    async setTypeSelect(type) {
        await this.typeSelect.sendKeys(type);
    }

    async getTypeSelect() {
        return this.typeSelect.element(by.css('option:checked')).getText();
    }

    async typeSelectLastOption() {
        await this.typeSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async companySelectLastOption() {
        await this.companySelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async companySelectOption(option) {
        await this.companySelect.sendKeys(option);
    }

    getCompanySelect(): ElementFinder {
        return this.companySelect;
    }

    async getCompanySelectedOption() {
        return this.companySelect.element(by.css('option:checked')).getText();
    }

    async departmentSelectLastOption() {
        await this.departmentSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async departmentSelectOption(option) {
        await this.departmentSelect.sendKeys(option);
    }

    getDepartmentSelect(): ElementFinder {
        return this.departmentSelect;
    }

    async getDepartmentSelectedOption() {
        return this.departmentSelect.element(by.css('option:checked')).getText();
    }

    async officeSelectLastOption() {
        await this.officeSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async officeSelectOption(option) {
        await this.officeSelect.sendKeys(option);
    }

    getOfficeSelect(): ElementFinder {
        return this.officeSelect;
    }

    async getOfficeSelectedOption() {
        return this.officeSelect.element(by.css('option:checked')).getText();
    }

    async shopSelectLastOption() {
        await this.shopSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async shopSelectOption(option) {
        await this.shopSelect.sendKeys(option);
    }

    getShopSelect(): ElementFinder {
        return this.shopSelect;
    }

    async getShopSelectedOption() {
        return this.shopSelect.element(by.css('option:checked')).getText();
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

export class MyAccountDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-myAccount-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-myAccount'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
