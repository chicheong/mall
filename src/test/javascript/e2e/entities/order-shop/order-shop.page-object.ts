import { element, by, ElementFinder } from 'protractor';

export class OrderShopComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-order-shop div table .btn-danger'));
    title = element.all(by.css('jhi-order-shop div h2#page-heading span')).first();

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

export class OrderShopUpdatePage {
    pageTitle = element(by.id('jhi-order-shop-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    totalInput = element(by.id('field_total'));
    currencySelect = element(by.id('field_currency'));
    remarkInput = element(by.id('field_remark'));
    shippingSelect = element(by.id('field_shipping'));
    shopSelect = element(by.id('field_shop'));
    orderSelect = element(by.id('field_order'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setTotalInput(total) {
        await this.totalInput.sendKeys(total);
    }

    async getTotalInput() {
        return this.totalInput.getAttribute('value');
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

    async setRemarkInput(remark) {
        await this.remarkInput.sendKeys(remark);
    }

    async getRemarkInput() {
        return this.remarkInput.getAttribute('value');
    }

    async shippingSelectLastOption() {
        await this.shippingSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async shippingSelectOption(option) {
        await this.shippingSelect.sendKeys(option);
    }

    getShippingSelect(): ElementFinder {
        return this.shippingSelect;
    }

    async getShippingSelectedOption() {
        return this.shippingSelect.element(by.css('option:checked')).getText();
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

    async orderSelectLastOption() {
        await this.orderSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async orderSelectOption(option) {
        await this.orderSelect.sendKeys(option);
    }

    getOrderSelect(): ElementFinder {
        return this.orderSelect;
    }

    async getOrderSelectedOption() {
        return this.orderSelect.element(by.css('option:checked')).getText();
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

export class OrderShopDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-orderShop-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-orderShop'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
