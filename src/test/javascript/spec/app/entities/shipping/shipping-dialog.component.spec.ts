/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { MallTestModule } from '../../../test.module';
import { ShippingDialogComponent } from '../../../../../../main/webapp/app/entities/shipping/shipping-dialog.component';
import { ShippingService } from '../../../../../../main/webapp/app/entities/shipping/shipping.service';
import { Shipping } from '../../../../../../main/webapp/app/entities/shipping/shipping.model';
import { MyOrderService } from '../../../../../../main/webapp/app/entities/my-order';
import { AddressService } from '../../../../../../main/webapp/app/entities/address';
import { ShippingTypeService } from '../../../../../../main/webapp/app/entities/shipping-type';

describe('Component Tests', () => {

    describe('Shipping Management Dialog Component', () => {
        let comp: ShippingDialogComponent;
        let fixture: ComponentFixture<ShippingDialogComponent>;
        let service: ShippingService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ShippingDialogComponent],
                providers: [
                    MyOrderService,
                    AddressService,
                    ShippingTypeService,
                    ShippingService
                ]
            })
            .overrideTemplate(ShippingDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ShippingDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ShippingService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Shipping(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.shipping = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'shippingListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Shipping();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.shipping = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'shippingListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
