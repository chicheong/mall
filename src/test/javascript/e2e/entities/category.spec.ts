import { browser, element, by, $ } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';
const path = require('path');

describe('Category e2e test', () => {

    let navBarPage: NavBarPage;
    let categoryDialogPage: CategoryDialogPage;
    let categoryComponentsPage: CategoryComponentsPage;
    const fileToUpload = '../../../../main/webapp/content/images/logo-jhipster.png';
    const absolutePath = path.resolve(__dirname, fileToUpload);
    

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Categories', () => {
        navBarPage.goToEntity('category');
        categoryComponentsPage = new CategoryComponentsPage();
        expect(categoryComponentsPage.getTitle()).toMatch(/mallApp.category.home.title/);

    });

    it('should load create Category dialog', () => {
        categoryComponentsPage.clickOnCreateButton();
        categoryDialogPage = new CategoryDialogPage();
        expect(categoryDialogPage.getModalTitle()).toMatch(/mallApp.category.home.createOrEditLabel/);
        categoryDialogPage.close();
    });

    it('should create and save Categories', () => {
        categoryComponentsPage.clickOnCreateButton();
        categoryDialogPage.setNameInput('name');
        expect(categoryDialogPage.getNameInput()).toMatch('name');
        categoryDialogPage.setDescriptionInput('description');
        expect(categoryDialogPage.getDescriptionInput()).toMatch('description');
        categoryDialogPage.statusSelectLastOption();
        categoryDialogPage.setCreatedByInput('createdBy');
        expect(categoryDialogPage.getCreatedByInput()).toMatch('createdBy');
        categoryDialogPage.setCreatedDateInput(12310020012301);
        expect(categoryDialogPage.getCreatedDateInput()).toMatch('2001-12-31T02:30');
        categoryDialogPage.setLastModifiedByInput('lastModifiedBy');
        expect(categoryDialogPage.getLastModifiedByInput()).toMatch('lastModifiedBy');
        categoryDialogPage.setLastModifiedDateInput(12310020012301);
        expect(categoryDialogPage.getLastModifiedDateInput()).toMatch('2001-12-31T02:30');
        categoryDialogPage.parentSelectLastOption();
        // categoryDialogPage.productSelectLastOption();
        categoryDialogPage.save();
        expect(categoryDialogPage.getSaveButton().isPresent()).toBeFalsy();
    }); 

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class CategoryComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-category div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class CategoryDialogPage {
    modalTitle = element(by.css('h4#myCategoryLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    descriptionInput = element(by.css('input#field_description'));
    statusSelect = element(by.css('select#field_status'));
    createdByInput = element(by.css('input#field_createdBy'));
    createdDateInput = element(by.css('input#field_createdDate'));
    lastModifiedByInput = element(by.css('input#field_lastModifiedBy'));
    lastModifiedDateInput = element(by.css('input#field_lastModifiedDate'));
    parentSelect = element(by.css('select#field_parent'));
    productSelect = element(by.css('select#field_product'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNameInput = function (name) {
        this.nameInput.sendKeys(name);
    }

    getNameInput = function () {
        return this.nameInput.getAttribute('value');
    }

    setDescriptionInput = function (description) {
        this.descriptionInput.sendKeys(description);
    }

    getDescriptionInput = function () {
        return this.descriptionInput.getAttribute('value');
    }

    setStatusSelect = function (status) {
        this.statusSelect.sendKeys(status);
    }

    getStatusSelect = function () {
        return this.statusSelect.element(by.css('option:checked')).getText();
    }

    statusSelectLastOption = function () {
        this.statusSelect.all(by.tagName('option')).last().click();
    }
    setCreatedByInput = function (createdBy) {
        this.createdByInput.sendKeys(createdBy);
    }

    getCreatedByInput = function () {
        return this.createdByInput.getAttribute('value');
    }

    setCreatedDateInput = function (createdDate) {
        this.createdDateInput.sendKeys(createdDate);
    }

    getCreatedDateInput = function () {
        return this.createdDateInput.getAttribute('value');
    }

    setLastModifiedByInput = function (lastModifiedBy) {
        this.lastModifiedByInput.sendKeys(lastModifiedBy);
    }

    getLastModifiedByInput = function () {
        return this.lastModifiedByInput.getAttribute('value');
    }

    setLastModifiedDateInput = function (lastModifiedDate) {
        this.lastModifiedDateInput.sendKeys(lastModifiedDate);
    }

    getLastModifiedDateInput = function () {
        return this.lastModifiedDateInput.getAttribute('value');
    }

    parentSelectLastOption = function () {
        this.parentSelect.all(by.tagName('option')).last().click();
    }

    parentSelectOption = function (option) {
        this.parentSelect.sendKeys(option);
    }

    getParentSelect = function () {
        return this.parentSelect;
    }

    getParentSelectedOption = function () {
        return this.parentSelect.element(by.css('option:checked')).getText();
    }

    productSelectLastOption = function () {
        this.productSelect.all(by.tagName('option')).last().click();
    }

    productSelectOption = function (option) {
        this.productSelect.sendKeys(option);
    }

    getProductSelect = function () {
        return this.productSelect;
    }

    getProductSelectedOption = function () {
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
