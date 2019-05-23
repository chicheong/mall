import { element, by, ElementFinder } from 'protractor';

export class CardComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-card div table .btn-danger'));
    title = element.all(by.css('jhi-card div h2#page-heading span')).first();

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

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setHolderNameInput(holderName) {
        await this.holderNameInput.sendKeys(holderName);
    }

    async getHolderNameInput() {
        return this.holderNameInput.getAttribute('value');
    }

    async setCardNumberInput(cardNumber) {
        await this.cardNumberInput.sendKeys(cardNumber);
    }

    async getCardNumberInput() {
        return this.cardNumberInput.getAttribute('value');
    }

    async setExpirationMonthInput(expirationMonth) {
        await this.expirationMonthInput.sendKeys(expirationMonth);
    }

    async getExpirationMonthInput() {
        return this.expirationMonthInput.getAttribute('value');
    }

    async setExpirationYearInput(expirationYear) {
        await this.expirationYearInput.sendKeys(expirationYear);
    }

    async getExpirationYearInput() {
        return this.expirationYearInput.getAttribute('value');
    }

    async setCvcInput(cvc) {
        await this.cvcInput.sendKeys(cvc);
    }

    async getCvcInput() {
        return this.cvcInput.getAttribute('value');
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

export class CardDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-card-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-card'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
