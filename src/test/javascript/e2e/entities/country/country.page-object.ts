import { element, by, ElementFinder } from 'protractor';

export class CountryComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-country div table .btn-danger'));
    title = element.all(by.css('jhi-country div h2#page-heading span')).first();

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

export class CountryUpdatePage {
    pageTitle = element(by.id('jhi-country-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    codeInput = element(by.id('field_code'));
    labelInput = element(by.id('field_label'));
    numInput = element(by.id('field_num'));
    nameInput = element(by.id('field_name'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setCodeInput(code) {
        await this.codeInput.sendKeys(code);
    }

    async getCodeInput() {
        return this.codeInput.getAttribute('value');
    }

    async setLabelInput(label) {
        await this.labelInput.sendKeys(label);
    }

    async getLabelInput() {
        return this.labelInput.getAttribute('value');
    }

    async setNumInput(num) {
        await this.numInput.sendKeys(num);
    }

    async getNumInput() {
        return this.numInput.getAttribute('value');
    }

    async setNameInput(name) {
        await this.nameInput.sendKeys(name);
    }

    async getNameInput() {
        return this.nameInput.getAttribute('value');
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

export class CountryDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-country-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-country'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
