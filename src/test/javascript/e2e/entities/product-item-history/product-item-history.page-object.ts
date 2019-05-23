import { element, by, ElementFinder } from 'protractor';

export class ProductItemHistoryComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-product-item-history div table .btn-danger'));
    title = element.all(by.css('jhi-product-item-history div h2#page-heading span')).first();

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

export class ProductItemHistoryUpdatePage {
    pageTitle = element(by.id('jhi-product-item-history-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    codeInput = element(by.id('field_code'));
    isDefaultInput = element(by.id('field_isDefault'));
    quantityInput = element(by.id('field_quantity'));
    currencySelect = element(by.id('field_currency'));
    priceInput = element(by.id('field_price'));
    createdByInput = element(by.id('field_createdBy'));
    createdDateInput = element(by.id('field_createdDate'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setCodeInput(code) {
        await this.codeInput.sendKeys(code);
    }

    async getCodeInput() {
        return this.codeInput.getAttribute('value');
    }

    getIsDefaultInput() {
        return this.isDefaultInput;
    }
    async setQuantityInput(quantity) {
        await this.quantityInput.sendKeys(quantity);
    }

    async getQuantityInput() {
        return this.quantityInput.getAttribute('value');
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

    async setPriceInput(price) {
        await this.priceInput.sendKeys(price);
    }

    async getPriceInput() {
        return this.priceInput.getAttribute('value');
    }

    async setCreatedByInput(createdBy) {
        await this.createdByInput.sendKeys(createdBy);
    }

    async getCreatedByInput() {
        return this.createdByInput.getAttribute('value');
    }

    async setCreatedDateInput(createdDate) {
        await this.createdDateInput.sendKeys(createdDate);
    }

    async getCreatedDateInput() {
        return this.createdDateInput.getAttribute('value');
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

export class ProductItemHistoryDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-productItemHistory-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-productItemHistory'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
