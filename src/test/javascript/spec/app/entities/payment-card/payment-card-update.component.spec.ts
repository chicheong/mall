/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { PaymentCardUpdateComponent } from 'app/entities/payment-card/payment-card-update.component';
import { PaymentCardService } from 'app/entities/payment-card/payment-card.service';
import { PaymentCard } from 'app/shared/model/payment-card.model';

describe('Component Tests', () => {
    describe('PaymentCard Management Update Component', () => {
        let comp: PaymentCardUpdateComponent;
        let fixture: ComponentFixture<PaymentCardUpdateComponent>;
        let service: PaymentCardService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [PaymentCardUpdateComponent]
            })
                .overrideTemplate(PaymentCardUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PaymentCardUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaymentCardService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new PaymentCard(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.paymentCard = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new PaymentCard();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.paymentCard = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
