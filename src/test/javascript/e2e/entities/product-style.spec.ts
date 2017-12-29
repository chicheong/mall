import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('ProductStyle e2e test', () => {

    let navBarPage: NavBarPage;
    let productStyleDialogPage: ProductStyleDialogPage;
    let productStyleComponentsPage: ProductStyleComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load ProductStyles', () => {
        navBarPage.goToEntity('product-style');
        productStyleComponentsPage = new ProductStyleComponentsPage();
        expect(productStyleComponentsPage.getTitle()).toMatch(/mallApp.productStyle.home.title/);

    });

    it('should load create ProductStyle dialog', () => {
        productStyleComponentsPage.clickOnCreateButton();
        productStyleDialogPage = new ProductStyleDialogPage();
        expect(productStyleDialogPage.getModalTitle()).toMatch(/mallApp.productStyle.home.createOrEditLabel/);
        productStyleDialogPage.close();
    });

    it('should create and save ProductStyles', () => {
        productStyleComponentsPage.clickOnCreateButton();
        productStyleDialogPage.setNameInput('name');
        expect(productStyleDialogPage.getNameInput()).toMatch('name');
        productStyleDialogPage.setCodeInput('code');
        expect(productStyleDialogPage.getCodeInput()).toMatch('code');
        productStyleDialogPage.getIsDefaultInput().isSelected().then((selected) => {
            if (selected) {
                productStyleDialogPage.getIsDefaultInput().click();
                expect(productStyleDialogPage.getIsDefaultInput().isSelected()).toBeFalsy();
            } else {
                productStyleDialogPage.getIsDefaultInput().click();
                expect(productStyleDialogPage.getIsDefaultInput().isSelected()).toBeTruthy();
            }
        });
        productStyleDialogPage.typeSelectLastOption();
        productStyleDialogPage.productSelectLastOption();
        productStyleDialogPage.save();
        expect(productStyleDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class ProductStyleComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-product-style div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class ProductStyleDialogPage {
    modalTitle = element(by.css('h4#myProductStyleLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    codeInput = element(by.css('input#field_code'));
    isDefaultInput = element(by.css('input#field_isDefault'));
    typeSelect = element(by.css('select#field_type'));
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

    getIsDefaultInput = function() {
        return this.isDefaultInput;
    }
    setTypeSelect = function(type) {
        this.typeSelect.sendKeys(type);
    }

    getTypeSelect = function() {
        return this.typeSelect.element(by.css('option:checked')).getText();
    }

    typeSelectLastOption = function() {
        this.typeSelect.all(by.tagName('option')).last().click();
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
