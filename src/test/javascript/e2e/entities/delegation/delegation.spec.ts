import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { DelegationComponentsPage, DelegationDeleteDialog, DelegationUpdatePage } from './delegation.page-object';

const expect = chai.expect;

describe('Delegation e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let delegationComponentsPage: DelegationComponentsPage;
  let delegationUpdatePage: DelegationUpdatePage;
  let delegationDeleteDialog: DelegationDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Delegations', async () => {
    await navBarPage.goToEntity('delegation');
    delegationComponentsPage = new DelegationComponentsPage();
    await browser.wait(ec.visibilityOf(delegationComponentsPage.title), 5000);
    expect(await delegationComponentsPage.getTitle()).to.eq('mallApp.delegation.home.title');
    await browser.wait(ec.or(ec.visibilityOf(delegationComponentsPage.entities), ec.visibilityOf(delegationComponentsPage.noResult)), 1000);
  });

  it('should load create Delegation page', async () => {
    await delegationComponentsPage.clickOnCreateButton();
    delegationUpdatePage = new DelegationUpdatePage();
    expect(await delegationUpdatePage.getPageTitle()).to.eq('mallApp.delegation.home.createOrEditLabel');
    await delegationUpdatePage.cancel();
  });

  it('should create and save Delegations', async () => {
    const nbButtonsBeforeCreate = await delegationComponentsPage.countDeleteButtons();

    await delegationComponentsPage.clickOnCreateButton();

    await promise.all([
      delegationUpdatePage.setFromInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      delegationUpdatePage.setToInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      delegationUpdatePage.typeSelectLastOption(),
      delegationUpdatePage.setDelegateIdInput('delegateId'),
      delegationUpdatePage.statusSelectLastOption(),
      delegationUpdatePage.setCreatedByInput('createdBy'),
      delegationUpdatePage.setCreatedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      delegationUpdatePage.setLastModifiedByInput('lastModifiedBy'),
      delegationUpdatePage.setLastModifiedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      delegationUpdatePage.accountSelectLastOption()
    ]);

    expect(await delegationUpdatePage.getFromInput()).to.contain('2001-01-01T02:30', 'Expected from value to be equals to 2000-12-31');
    expect(await delegationUpdatePage.getToInput()).to.contain('2001-01-01T02:30', 'Expected to value to be equals to 2000-12-31');
    expect(await delegationUpdatePage.getDelegateIdInput()).to.eq('delegateId', 'Expected DelegateId value to be equals to delegateId');
    expect(await delegationUpdatePage.getCreatedByInput()).to.eq('createdBy', 'Expected CreatedBy value to be equals to createdBy');
    expect(await delegationUpdatePage.getCreatedDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected createdDate value to be equals to 2000-12-31'
    );
    expect(await delegationUpdatePage.getLastModifiedByInput()).to.eq(
      'lastModifiedBy',
      'Expected LastModifiedBy value to be equals to lastModifiedBy'
    );
    expect(await delegationUpdatePage.getLastModifiedDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected lastModifiedDate value to be equals to 2000-12-31'
    );

    await delegationUpdatePage.save();
    expect(await delegationUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await delegationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Delegation', async () => {
    const nbButtonsBeforeDelete = await delegationComponentsPage.countDeleteButtons();
    await delegationComponentsPage.clickOnLastDeleteButton();

    delegationDeleteDialog = new DelegationDeleteDialog();
    expect(await delegationDeleteDialog.getDialogTitle()).to.eq('mallApp.delegation.delete.question');
    await delegationDeleteDialog.clickOnConfirmButton();

    expect(await delegationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
