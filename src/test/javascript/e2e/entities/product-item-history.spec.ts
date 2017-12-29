import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('ProductItemHistory e2e test', () => {

    let navBarPage: NavBarPage;
    let productItemHistoryDialogPage: ProductItemHistoryDialogPage;
    let productItemHistoryComponentsPage: ProductItemHistoryComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load ProductItemHistories', () => {
        navBarPage.goToEntity('product-item-history');
        productItemHistoryComponentsPage = new ProductItemHistoryComponentsPage();
        expect(productItemHistoryComponentsPage.getTitle()).toMatch(/mallApp.productItemHistory.home.title/);

    });

    it('should load create ProductItemHistory dialog', () => {
        productItemHistoryComponentsPage.clickOnCreateButton();
        productItemHistoryDialogPage = new ProductItemHistoryDialogPage();
        expect(productItemHistoryDialogPage.getModalTitle()).toMatch(/mallApp.productItemHistory.home.createOrEditLabel/);
        productItemHistoryDialogPage.close();
    });

    it('should create and save ProductItemHistories', () => {
        productItemHistoryComponentsPage.clickOnCreateButton();
        productItemHistoryDialogPage.setCodeInput('code');
        expect(productItemHistoryDialogPage.getCodeInput()).toMatch('code');
        productItemHistoryDialogPage.getIsDefaultInput().isSelected().then((selected) => {
            if (selected) {
                productItemHistoryDialogPage.getIsDefaultInput().click();
                expect(productItemHistoryDialogPage.getIsDefaultInput().isSelected()).toBeFalsy();
            } else {
                productItemHistoryDialogPage.getIsDefaultInput().click();
                expect(productItemHistoryDialogPage.getIsDefaultInput().isSelected()).toBeTruthy();
            }
        });
        productItemHistoryDialogPage.setQuantityInput('5');
        expect(productItemHistoryDialogPage.getQuantityInput()).toMatch('5');
        productItemHistoryDialogPage.currencySelectLastOption();
        productItemHistoryDialogPage.setPriceInput('5');
        expect(productItemHistoryDialogPage.getPriceInput()).toMatch('5');
        productItemHistoryDialogPage.setCreatedByInput('createdBy');
        expect(productItemHistoryDialogPage.getCreatedByInput()).toMatch('createdBy');
        productItemHistoryDialogPage.setCreatedDateInput(12310020012301);
        expect(productItemHistoryDialogPage.getCreatedDateInput()).toMatch('2001-12-31T02:30');
        productItemHistoryDialogPage.save();
        expect(productItemHistoryDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class ProductItemHistoryComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-product-item-history div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class ProductItemHistoryDialogPage {
    modalTitle = element(by.css('h4#myProductItemHistoryLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    codeInput = element(by.css('input#field_code'));
    isDefaultInput = element(by.css('input#field_isDefault'));
    quantityInput = element(by.css('input#field_quantity'));
    currencySelect = element(by.css('select#field_currency'));
    priceInput = element(by.css('input#field_price'));
    createdByInput = element(by.css('input#field_createdBy'));
    createdDateInput = element(by.css('input#field_createdDate'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setCodeInput = function(code) {
        this.codeInput.sendKeys(code);
    }

    getCodeInput = function() {
        return this.codeInput.getAttribute('value');
    }

    getIsDefaultInput = function() {
        return this.isDefaultInput;
    }
    setQuantityInput = function(quantity) {
        this.quantityInput.sendKeys(quantity);
    }

    getQuantityInput = function() {
        return this.quantityInput.getAttribute('value');
    }

    setCurrencySelect = function(currency) {
        this.currencySelect.sendKeys(currency);
    }

    getCurrencySelect = function() {
        return this.currencySelect.element(by.css('option:checked')).getText();
    }

    currencySelectLastOption = function() {
        this.currencySelect.all(by.tagName('option')).last().click();
    }
    setPriceInput = function(price) {
        this.priceInput.sendKeys(price);
    }

    getPriceInput = function() {
        return this.priceInput.getAttribute('value');
    }

    setCreatedByInput = function(createdBy) {
        this.createdByInput.sendKeys(createdBy);
    }

    getCreatedByInput = function() {
        return this.createdByInput.getAttribute('value');
    }

    setCreatedDateInput = function(createdDate) {
        this.createdDateInput.sendKeys(createdDate);
    }

    getCreatedDateInput = function() {
        return this.createdDateInput.getAttribute('value');
    }

    save() {
        this.saveButton.click();
    }

    close() {
        this.closeButton.click();
    }

    getSaveButton() {
        return this.saveButton;
    }
}
