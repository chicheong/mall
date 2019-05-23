import { element, by, ElementFinder } from 'protractor';

export class QuantityComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-quantity div table .btn-danger'));
    title = element.all(by.css('jhi-quantity div h2#page-heading span')).first();

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

export class QuantityUpdatePage {
    pageTitle = element(by.id('jhi-quantity-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    fromInput = element(by.id('field_from'));
    toInput = element(by.id('field_to'));
    quantityInput = element(by.id('field_quantity'));
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

    async setQuantityInput(quantity) {
        await this.quantityInput.sendKeys(quantity);
    }

    async getQuantityInput() {
        return this.quantityInput.getAttribute('value');
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

export class QuantityDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-quantity-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-quantity'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
