import { element, by, ElementFinder } from 'protractor';

export class CurrencyRateComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-currency-rate div table .btn-danger'));
    title = element.all(by.css('jhi-currency-rate div h2#page-heading span')).first();

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

export class CurrencyRateUpdatePage {
    pageTitle = element(by.id('jhi-currency-rate-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    fromInput = element(by.id('field_from'));
    toInput = element(by.id('field_to'));
    rateInput = element(by.id('field_rate'));
    sourceCurrencySelect = element(by.id('field_sourceCurrency'));
    targetCurrencySelect = element(by.id('field_targetCurrency'));

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

    async setRateInput(rate) {
        await this.rateInput.sendKeys(rate);
    }

    async getRateInput() {
        return this.rateInput.getAttribute('value');
    }

    async setSourceCurrencySelect(sourceCurrency) {
        await this.sourceCurrencySelect.sendKeys(sourceCurrency);
    }

    async getSourceCurrencySelect() {
        return this.sourceCurrencySelect.element(by.css('option:checked')).getText();
    }

    async sourceCurrencySelectLastOption() {
        await this.sourceCurrencySelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async setTargetCurrencySelect(targetCurrency) {
        await this.targetCurrencySelect.sendKeys(targetCurrency);
    }

    async getTargetCurrencySelect() {
        return this.targetCurrencySelect.element(by.css('option:checked')).getText();
    }

    async targetCurrencySelectLastOption() {
        await this.targetCurrencySelect
            .all(by.tagName('option'))
            .last()
            .click();
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

export class CurrencyRateDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-currencyRate-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-currencyRate'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
