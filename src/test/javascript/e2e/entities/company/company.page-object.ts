import { element, by, ElementFinder } from 'protractor';

export class CompanyComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-company div table .btn-danger'));
    title = element.all(by.css('jhi-company div h2#page-heading span')).first();

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

export class CompanyUpdatePage {
    pageTitle = element(by.id('jhi-company-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    codeInput = element(by.id('field_code'));
    nameInput = element(by.id('field_name'));
    statusSelect = element(by.id('field_status'));
    parentSelect = element(by.id('field_parent'));
    departmentSelect = element(by.id('field_department'));
    officeSelect = element(by.id('field_office'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setCodeInput(code) {
        await this.codeInput.sendKeys(code);
    }

    async getCodeInput() {
        return this.codeInput.getAttribute('value');
    }

    async setNameInput(name) {
        await this.nameInput.sendKeys(name);
    }

    async getNameInput() {
        return this.nameInput.getAttribute('value');
    }

    async setStatusSelect(status) {
        await this.statusSelect.sendKeys(status);
    }

    async getStatusSelect() {
        return this.statusSelect.element(by.css('option:checked')).getText();
    }

    async statusSelectLastOption() {
        await this.statusSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async parentSelectLastOption() {
        await this.parentSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async parentSelectOption(option) {
        await this.parentSelect.sendKeys(option);
    }

    getParentSelect(): ElementFinder {
        return this.parentSelect;
    }

    async getParentSelectedOption() {
        return this.parentSelect.element(by.css('option:checked')).getText();
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

export class CompanyDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-company-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-company'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
