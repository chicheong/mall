/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { ShippingStatusHistoryDetailComponent } from 'app/entities/shipping-status-history/shipping-status-history-detail.component';
import { ShippingStatusHistory } from 'app/shared/model/shipping-status-history.model';

describe('Component Tests', () => {
    describe('ShippingStatusHistory Management Detail Component', () => {
        let comp: ShippingStatusHistoryDetailComponent;
        let fixture: ComponentFixture<ShippingStatusHistoryDetailComponent>;
        const route = ({ data: of({ shippingStatusHistory: new ShippingStatusHistory(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ShippingStatusHistoryDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ShippingStatusHistoryDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ShippingStatusHistoryDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.shippingStatusHistory).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
