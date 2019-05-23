import { element, by, ElementFinder } from 'protractor';

export class ProductStyleComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-product-style div table .btn-danger'));
    title = element.all(by.css('jhi-product-style div h2#page-heading span')).first();

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

export class ProductStyleUpdatePage {
    pageTitle = element(by.id('jhi-product-style-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    nameInput = element(by.id('field_name'));
    codeInput = element(by.id('field_code'));
    isDefaultInput = element(by.id('field_isDefault'));
    typeSelect = element(by.id('field_type'));
    productSelect = element(by.id('field_product'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setNameInput(name) {
        await this.nameInput.sendKeys(name);
    }

    async getNameInput() {
        return this.nameInput.getAttribute('value');
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

    async productSelectLastOption() {
        await this.productSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async productSelectOption(option) {
        await this.productSelect.sendKeys(option);
    }

    getProductSelect(): ElementFinder {
        return this.productSelect;
    }

    async getProductSelectedOption() {
        return this.productSelect.element(by.css('option:checked')).getText();
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

export class ProductStyleDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-productStyle-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-productStyle'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
