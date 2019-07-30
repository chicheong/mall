import { element, by, ElementFinder } from 'protractor';

export class ShippingPriceRuleComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-shipping-price-rule div table .btn-danger'));
    title = element.all(by.css('jhi-shipping-price-rule div h2#page-heading span')).first();

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

export class ShippingPriceRuleUpdatePage {
    pageTitle = element(by.id('jhi-shipping-price-rule-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    typeSelect = element(by.id('field_type'));
    valueInput = element(by.id('field_value'));
    priceInput = element(by.id('field_price'));
    sequenceInput = element(by.id('field_sequence'));
    shopSelect = element(by.id('field_shop'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
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

    async setValueInput(value) {
        await this.valueInput.sendKeys(value);
    }

    async getValueInput() {
        return this.valueInput.getAttribute('value');
    }

    async setPriceInput(price) {
        await this.priceInput.sendKeys(price);
    }

    async getPriceInput() {
        return this.priceInput.getAttribute('value');
    }

    async setSequenceInput(sequence) {
        await this.sequenceInput.sendKeys(sequence);
    }

    async getSequenceInput() {
        return this.sequenceInput.getAttribute('value');
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

export class ShippingPriceRuleDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-shippingPriceRule-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-shippingPriceRule'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
