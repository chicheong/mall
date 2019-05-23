import { element, by, ElementFinder } from 'protractor';

export class PriceComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-price div table .btn-danger'));
    title = element.all(by.css('jhi-price div h2#page-heading span')).first();

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

export class PriceUpdatePage {
    pageTitle = element(by.id('jhi-price-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    fromInput = element(by.id('field_from'));
    toInput = element(by.id('field_to'));
    priceInput = element(by.id('field_price'));
    currencySelect = element(by.id('field_currency'));
    itemSelect = element(by.id('field_item'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setFromInput(from) {
        await this.fromInput.sendKeys(from);
    }

    async getFromInput() {
        return this.fromInput.getAttribute('value');
    }

    async setToInput(to) {
        await this.toInput.sendKeys(to);
    }

    async getToInput() {
        return this.toInput.getAttribute('value');
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

    async itemSelectLastOption() {
        await this.itemSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async itemSelectOption(option) {
        await this.itemSelect.sendKeys(option);
    }

    getItemSelect(): ElementFinder {
        return this.itemSelect;
    }

    async getItemSelectedOption() {
        return this.itemSelect.element(by.css('option:checked')).getText();
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

export class PriceDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-price-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-price'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
