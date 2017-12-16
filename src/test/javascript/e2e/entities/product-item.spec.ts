import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('ProductItem e2e test', () => {

    let navBarPage: NavBarPage;
    let productItemDialogPage: ProductItemDialogPage;
    let productItemComponentsPage: ProductItemComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load ProductItems', () => {
        navBarPage.goToEntity('product-item');
        productItemComponentsPage = new ProductItemComponentsPage();
        expect(productItemComponentsPage.getTitle()).toMatch(/mallApp.productItem.home.title/);

    });

    it('should load create ProductItem dialog', () => {
        productItemComponentsPage.clickOnCreateButton();
        productItemDialogPage = new ProductItemDialogPage();
        expect(productItemDialogPage.getModalTitle()).toMatch(/mallApp.productItem.home.createOrEditLabel/);
        productItemDialogPage.close();
    });

    it('should create and save ProductItems', () => {
        productItemComponentsPage.clickOnCreateButton();
        productItemDialogPage.setNameInput('name');
        expect(productItemDialogPage.getNameInput()).toMatch('name');
        productItemDialogPage.setCodeInput('code');
        expect(productItemDialogPage.getCodeInput()).toMatch('code');
        productItemDialogPage.getDefaultItemInput().isSelected().then((selected) => {
            if (selected) {
                productItemDialogPage.getDefaultItemInput().click();
                expect(productItemDialogPage.getDefaultItemInput().isSelected()).toBeFalsy();
            } else {
                productItemDialogPage.getDefaultItemInput().click();
                expect(productItemDialogPage.getDefaultItemInput().isSelected()).toBeTruthy();
            }
        });
        productItemDialogPage.setColorInput('color');
        expect(productItemDialogPage.getColorInput()).toMatch('color');
        productItemDialogPage.setSizeInput('size');
        expect(productItemDialogPage.getSizeInput()).toMatch('size');
        productItemDialogPage.setQuantityInput('5');
        expect(productItemDialogPage.getQuantityInput()).toMatch('5');
        productItemDialogPage.currencySelectLastOption();
        productItemDialogPage.setPriceInput('5');
        expect(productItemDialogPage.getPriceInput()).toMatch('5');
        productItemDialogPage.setCreatedByInput('createdBy');
        expect(productItemDialogPage.getCreatedByInput()).toMatch('createdBy');
        productItemDialogPage.setCreatedDateInput(12310020012301);
        expect(productItemDialogPage.getCreatedDateInput()).toMatch('2001-12-31T02:30');
        productItemDialogPage.setLastModifiedByInput('lastModifiedBy');
        expect(productItemDialogPage.getLastModifiedByInput()).toMatch('lastModifiedBy');
        productItemDialogPage.setLastModifiedDateInput(12310020012301);
        expect(productItemDialogPage.getLastModifiedDateInput()).toMatch('2001-12-31T02:30');
        productItemDialogPage.productSelectLastOption();
        productItemDialogPage.save();
        expect(productItemDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class ProductItemComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-product-item div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class ProductItemDialogPage {
    modalTitle = element(by.css('h4#myProductItemLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    codeInput = element(by.css('input#field_code'));
    defaultItemInput = element(by.css('input#field_defaultItem'));
    colorInput = element(by.css('input#field_color'));
    sizeInput = element(by.css('input#field_size'));
    quantityInput = element(by.css('input#field_quantity'));
    currencySelect = element(by.css('select#field_currency'));
    priceInput = element(by.css('input#field_price'));
    createdByInput = element(by.css('input#field_createdBy'));
    createdDateInput = element(by.css('input#field_createdDate'));
    lastModifiedByInput = element(by.css('input#field_lastModifiedBy'));
    lastModifiedDateInput = element(by.css('input#field_lastModifiedDate'));
    productSelect = element(by.css('select#field_product'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNameInput = function(name) {
        this.nameInput.sendKeys(name);
    }

    getNameInput = function() {
        return this.nameInput.getAttribute('value');
    }

    setCodeInput = function(code) {
        this.codeInput.sendKeys(code);
    }

    getCodeInput = function() {
        return this.codeInput.getAttribute('value');
    }

    getDefaultItemInput = function() {
        return this.defaultItemInput;
    }
    setColorInput = function(color) {
        this.colorInput.sendKeys(color);
    }

    getColorInput = function() {
        return this.colorInput.getAttribute('value');
    }

    setSizeInput = function(size) {
        this.sizeInput.sendKeys(size);
    }

    getSizeInput = function() {
        return this.sizeInput.getAttribute('value');
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

    setLastModifiedByInput = function(lastModifiedBy) {
        this.lastModifiedByInput.sendKeys(lastModifiedBy);
    }

    getLastModifiedByInput = function() {
        return this.lastModifiedByInput.getAttribute('value');
    }

    setLastModifiedDateInput = function(lastModifiedDate) {
        this.lastModifiedDateInput.sendKeys(lastModifiedDate);
    }

    getLastModifiedDateInput = function() {
        return this.lastModifiedDateInput.getAttribute('value');
    }

    productSelectLastOption = function() {
        this.productSelect.all(by.tagName('option')).last().click();
    }

    productSelectOption = function(option) {
        this.productSelect.sendKeys(option);
    }

    getProductSelect = function() {
        return this.productSelect;
    }

    getProductSelectedOption = function() {
        return this.productSelect.element(by.css('option:checked')).getText();
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
