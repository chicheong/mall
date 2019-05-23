import { element, by, ElementFinder } from 'protractor';

export class ShippingComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-shipping div table .btn-danger'));
    title = element.all(by.css('jhi-shipping div h2#page-heading span')).first();

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

export class ShippingUpdatePage {
    pageTitle = element(by.id('jhi-shipping-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    priceInput = element(by.id('field_price'));
    currencySelect = element(by.id('field_currency'));
    dateInput = element(by.id('field_date'));
    statusSelect = element(by.id('field_status'));
    typeSelect = element(by.id('field_type'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setPriceInput(price) {
        await this.priceInput.sendKeys(price);
    }

    async getPriceInput() {
        return this.priceInput.getAttribute('value');
    }

    async setCurrencySelect(currency) {
        await this.currencySelect.sendKeys(currency);
    }

    async getCurrencySelect() {
        return this.currencySelect.element(by.css('option:checked')).getText();
    }

    async currencySelectLastOption() {
        await this.currencySelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async setDateInput(date) {
        await this.dateInput.sendKeys(date);
    }

    async getDateInput() {
        return this.dateInput.getAttribute('value');
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

    async typeSelectLastOption() {
        await this.typeSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async typeSelectOption(option) {
        await this.typeSelect.sendKeys(option);
    }

    getTypeSelect(): ElementFinder {
        return this.typeSelect;
    }

    async getTypeSelectedOption() {
        return this.typeSelect.element(by.css('option:checked')).getText();
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

export class ShippingDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-shipping-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-shipping'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
