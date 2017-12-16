import { browser, element, by, $ } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';
const path = require('path');

describe('Delegation e2e test', () => {

    let navBarPage: NavBarPage;
    let delegationDialogPage: DelegationDialogPage;
    let delegationComponentsPage: DelegationComponentsPage;
    const fileToUpload = '../../../../main/webapp/content/images/logo-jhipster.png';
    const absolutePath = path.resolve(__dirname, fileToUpload);
    

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Delegations', () => {
        navBarPage.goToEntity('delegation');
        delegationComponentsPage = new DelegationComponentsPage();
        expect(delegationComponentsPage.getTitle()).toMatch(/mallApp.delegation.home.title/);

    });

    it('should load create Delegation dialog', () => {
        delegationComponentsPage.clickOnCreateButton();
        delegationDialogPage = new DelegationDialogPage();
        expect(delegationDialogPage.getModalTitle()).toMatch(/mallApp.delegation.home.createOrEditLabel/);
        delegationDialogPage.close();
    });

    it('should create and save Delegations', () => {
        delegationComponentsPage.clickOnCreateButton();
        delegationDialogPage.setFromInput(12310020012301);
        expect(delegationDialogPage.getFromInput()).toMatch('2001-12-31T02:30');
        delegationDialogPage.setToInput(12310020012301);
        expect(delegationDialogPage.getToInput()).toMatch('2001-12-31T02:30');
        delegationDialogPage.typeSelectLastOption();
        delegationDialogPage.setDelegateIdInput('delegateId');
        expect(delegationDialogPage.getDelegateIdInput()).toMatch('delegateId');
        delegationDialogPage.statusSelectLastOption();
        delegationDialogPage.setCreatedByInput('createdBy');
        expect(delegationDialogPage.getCreatedByInput()).toMatch('createdBy');
        delegationDialogPage.setCreatedDateInput(12310020012301);
        expect(delegationDialogPage.getCreatedDateInput()).toMatch('2001-12-31T02:30');
        delegationDialogPage.setLastModifiedByInput('lastModifiedBy');
        expect(delegationDialogPage.getLastModifiedByInput()).toMatch('lastModifiedBy');
        delegationDialogPage.setLastModifiedDateInput(12310020012301);
        expect(delegationDialogPage.getLastModifiedDateInput()).toMatch('2001-12-31T02:30');
        delegationDialogPage.accountSelectLastOption();
        delegationDialogPage.save();
        expect(delegationDialogPage.getSaveButton().isPresent()).toBeFalsy();
    }); 

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class DelegationComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-delegation div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class DelegationDialogPage {
    modalTitle = element(by.css('h4#myDelegationLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    fromInput = element(by.css('input#field_from'));
    toInput = element(by.css('input#field_to'));
    typeSelect = element(by.css('select#field_type'));
    delegateIdInput = element(by.css('input#field_delegateId'));
    statusSelect = element(by.css('select#field_status'));
    createdByInput = element(by.css('input#field_createdBy'));
    createdDateInput = element(by.css('input#field_createdDate'));
    lastModifiedByInput = element(by.css('input#field_lastModifiedBy'));
    lastModifiedDateInput = element(by.css('input#field_lastModifiedDate'));
    accountSelect = element(by.css('select#field_account'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setFromInput = function (from) {
        this.fromInput.sendKeys(from);
    }

    getFromInput = function () {
        return this.fromInput.getAttribute('value');
    }

    setToInput = function (to) {
        this.toInput.sendKeys(to);
    }

    getToInput = function () {
        return this.toInput.getAttribute('value');
    }

    setTypeSelect = function (type) {
        this.typeSelect.sendKeys(type);
    }

    getTypeSelect = function () {
        return this.typeSelect.element(by.css('option:checked')).getText();
    }

    typeSelectLastOption = function () {
        this.typeSelect.all(by.tagName('option')).last().click();
    }
    setDelegateIdInput = function (delegateId) {
        this.delegateIdInput.sendKeys(delegateId);
    }

    getDelegateIdInput = function () {
        return this.delegateIdInput.getAttribute('value');
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

    accountSelectLastOption = function () {
        this.accountSelect.all(by.tagName('option')).last().click();
    }

    accountSelectOption = function (option) {
        this.accountSelect.sendKeys(option);
    }

    getAccountSelect = function () {
        return this.accountSelect;
    }

    getAccountSelectedOption = function () {
        return this.accountSelect.element(by.css('option:checked')).getText();
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
