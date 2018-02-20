import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('ProductHistory e2e test', () => {

    let navBarPage: NavBarPage;
    let productHistoryDialogPage: ProductHistoryDialogPage;
    let productHistoryComponentsPage: ProductHistoryComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load ProductHistories', () => {
        navBarPage.goToEntity('product-history');
        productHistoryComponentsPage = new ProductHistoryComponentsPage();
        expect(productHistoryComponentsPage.getTitle())
            .toMatch(/mallApp.productHistory.home.title/);

    });

    it('should load create ProductHistory dialog', () => {
        productHistoryComponentsPage.clickOnCreateButton();
        productHistoryDialogPage = new ProductHistoryDialogPage();
        expect(productHistoryDialogPage.getModalTitle())
            .toMatch(/mallApp.productHistory.home.createOrEditLabel/);
        productHistoryDialogPage.close();
    });

    it('should create and save ProductHistories', () => {
        productHistoryComponentsPage.clickOnCreateButton();
        productHistoryDialogPage.setProductIdInput('5');
        expect(productHistoryDialogPage.getProductIdInput()).toMatch('5');
        productHistoryDialogPage.setNameInput('name');
        expect(productHistoryDialogPage.getNameInput()).toMatch('name');
        productHistoryDialogPage.setCodeInput('code');
        expect(productHistoryDialogPage.getCodeInput()).toMatch('code');
        productHistoryDialogPage.setBrandInput('brand');
        expect(productHistoryDialogPage.getBrandInput()).toMatch('brand');
        productHistoryDialogPage.setDescriptionInput('description');
        expect(productHistoryDialogPage.getDescriptionInput()).toMatch('description');
        productHistoryDialogPage.setContentInput('content');
        expect(productHistoryDialogPage.getContentInput()).toMatch('content');
        productHistoryDialogPage.setRemarkInput('remark');
        expect(productHistoryDialogPage.getRemarkInput()).toMatch('remark');
        productHistoryDialogPage.statusSelectLastOption();
        productHistoryDialogPage.setCreatedByInput('createdBy');
        expect(productHistoryDialogPage.getCreatedByInput()).toMatch('createdBy');
        productHistoryDialogPage.setCreatedDateInput(12310020012301);
        expect(productHistoryDialogPage.getCreatedDateInput()).toMatch('2001-12-31T02:30');
        productHistoryDialogPage.save();
        expect(productHistoryDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class ProductHistoryComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-product-history div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class ProductHistoryDialogPage {
    modalTitle = element(by.css('h4#myProductHistoryLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    productIdInput = element(by.css('input#field_productId'));
    nameInput = element(by.css('input#field_name'));
    codeInput = element(by.css('input#field_code'));
    brandInput = element(by.css('input#field_brand'));
    descriptionInput = element(by.css('input#field_description'));
    contentInput = element(by.css('input#field_content'));
    remarkInput = element(by.css('input#field_remark'));
    statusSelect = element(by.css('select#field_status'));
    createdByInput = element(by.css('input#field_createdBy'));
    createdDateInput = element(by.css('input#field_createdDate'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setProductIdInput = function(productId) {
        this.productIdInput.sendKeys(productId);
    }

    getProductIdInput = function() {
        return this.productIdInput.getAttribute('value');
    }

    setNameInput = function(name) {
        this.nameInput.sendKeys(name);
    };

    getNameInput = function() {
        return this.nameInput.getAttribute('value');
    };

    setCodeInput = function(code) {
        this.codeInput.sendKeys(code);
    };

    getCodeInput = function() {
        return this.codeInput.getAttribute('value');
    };

    setBrandInput = function(brand) {
        this.brandInput.sendKeys(brand);
    };

    getBrandInput = function() {
        return this.brandInput.getAttribute('value');
    };

    setDescriptionInput = function(description) {
        this.descriptionInput.sendKeys(description);
    };

    getDescriptionInput = function() {
        return this.descriptionInput.getAttribute('value');
    };

    setContentInput = function(content) {
        this.contentInput.sendKeys(content);
    };

    getContentInput = function() {
        return this.contentInput.getAttribute('value');
    };

    setRemarkInput = function(remark) {
        this.remarkInput.sendKeys(remark);
    };

    getRemarkInput = function() {
        return this.remarkInput.getAttribute('value');
    };

    setStatusSelect = function(status) {
        this.statusSelect.sendKeys(status);
    };

    getStatusSelect = function() {
        return this.statusSelect.element(by.css('option:checked')).getText();
    };

    statusSelectLastOption = function() {
        this.statusSelect.all(by.tagName('option')).last().click();
    };
    setCreatedByInput = function(createdBy) {
        this.createdByInput.sendKeys(createdBy);
    };

    getCreatedByInput = function() {
        return this.createdByInput.getAttribute('value');
    };

    setCreatedDateInput = function(createdDate) {
        this.createdDateInput.sendKeys(createdDate);
    };

    getCreatedDateInput = function() {
        return this.createdDateInput.getAttribute('value');
    };

    setLastModifiedByInput = function(lastModifiedBy) {
        this.lastModifiedByInput.sendKeys(lastModifiedBy);
    };

    getLastModifiedByInput = function() {
        return this.lastModifiedByInput.getAttribute('value');
    };

    setLastModifiedDateInput = function(lastModifiedDate) {
        this.lastModifiedDateInput.sendKeys(lastModifiedDate);
    };

    getLastModifiedDateInput = function() {
        return this.lastModifiedDateInput.getAttribute('value');
    };

    productSelectLastOption = function() {
        this.productSelect.all(by.tagName('option')).last().click();
    };

    productSelectOption = function(option) {
        this.productSelect.sendKeys(option);
    };

    getProductSelect = function() {
        return this.productSelect;
    };

    getProductSelectedOption = function() {
        return this.productSelect.element(by.css('option:checked')).getText();
    };

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
