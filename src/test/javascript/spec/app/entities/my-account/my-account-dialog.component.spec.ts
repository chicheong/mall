/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { MallTestModule } from '../../../test.module';
import { MyAccountDialogComponent } from '../../../../../../main/webapp/app/entities/my-account/my-account-dialog.component';
import { MyAccountService } from '../../../../../../main/webapp/app/entities/my-account/my-account.service';
import { MyAccount } from '../../../../../../main/webapp/app/entities/my-account/my-account.model';
import { CompanyService } from '../../../../../../main/webapp/app/entities/company';
import { DepartmentService } from '../../../../../../main/webapp/app/entities/department';
import { OfficeService } from '../../../../../../main/webapp/app/entities/office';
import { ShopService } from '../../../../../../main/webapp/app/entities/shop';
import { UserInfoService } from '../../../../../../main/webapp/app/entities/user-info';

describe('Component Tests', () => {

    describe('MyAccount Management Dialog Component', () => {
        let comp: MyAccountDialogComponent;
        let fixture: ComponentFixture<MyAccountDialogComponent>;
        let service: MyAccountService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [MyAccountDialogComponent],
                providers: [
                    CompanyService,
                    DepartmentService,
                    OfficeService,
                    ShopService,
                    UserInfoService,
                    MyAccountService
                ]
            })
            .overrideTemplate(MyAccountDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MyAccountDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MyAccountService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new MyAccount(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.myAccount = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'myAccountListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new MyAccount();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.myAccount = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'myAccountListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
