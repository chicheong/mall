import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('OrderStatusHistory e2e test', () => {

    let navBarPage: NavBarPage;
    let orderStatusHistoryDialogPage: OrderStatusHistoryDialogPage;
    let orderStatusHistoryComponentsPage: OrderStatusHistoryComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load OrderStatusHistories', () => {
        navBarPage.goToEntity('order-status-history');
        orderStatusHistoryComponentsPage = new OrderStatusHistoryComponentsPage();
        expect(orderStatusHistoryComponentsPage.getTitle())
            .toMatch(/mallApp.orderStatusHistory.home.title/);

    });

    it('should load create OrderStatusHistory dialog', () => {
        orderStatusHistoryComponentsPage.clickOnCreateButton();
        orderStatusHistoryDialogPage = new OrderStatusHistoryDialogPage();
        expect(orderStatusHistoryDialogPage.getModalTitle())
            .toMatch(/mallApp.orderStatusHistory.home.createOrEditLabel/);
        orderStatusHistoryDialogPage.close();
    });

    it('should create and save OrderStatusHistories', () => {
        orderStatusHistoryComponentsPage.clickOnCreateButton();
        orderStatusHistoryDialogPage.setEffectiveDateInput(12310020012301);
        expect(orderStatusHistoryDialogPage.getEffectiveDateInput()).toMatch('2001-12-31T02:30');
        orderStatusHistoryDialogPage.statusSelectLastOption();
        orderStatusHistoryDialogPage.orderSelectLastOption();
        orderStatusHistoryDialogPage.save();
        expect(orderStatusHistoryDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class OrderStatusHistoryComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-order-status-history div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class OrderStatusHistoryDialogPage {
    modalTitle = element(by.css('h4#myOrderStatusHistoryLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    effectiveDateInput = element(by.css('input#field_effectiveDate'));
    statusSelect = element(by.css('select#field_status'));
    orderSelect = element(by.css('select#field_order'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setEffectiveDateInput = function(effectiveDate) {
        this.effectiveDateInput.sendKeys(effectiveDate);
    };

    getEffectiveDateInput = function() {
        return this.effectiveDateInput.getAttribute('value');
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
    orderSelectLastOption = function() {
        this.orderSelect.all(by.tagName('option')).last().click();
    };

    orderSelectOption = function(option) {
        this.orderSelect.sendKeys(option);
    };

    getOrderSelect = function() {
        return this.orderSelect;
    };

    getOrderSelectedOption = function() {
        return this.orderSelect.element(by.css('option:checked')).getText();
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
