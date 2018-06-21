/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { MallTestModule } from '../../../test.module';
import { ShippingStatusHistoryDetailComponent } from '../../../../../../main/webapp/app/entities/shipping-status-history/shipping-status-history-detail.component';
import { ShippingStatusHistoryService } from '../../../../../../main/webapp/app/entities/shipping-status-history/shipping-status-history.service';
import { ShippingStatusHistory } from '../../../../../../main/webapp/app/entities/shipping-status-history/shipping-status-history.model';

describe('Component Tests', () => {

    describe('ShippingStatusHistory Management Detail Component', () => {
        let comp: ShippingStatusHistoryDetailComponent;
        let fixture: ComponentFixture<ShippingStatusHistoryDetailComponent>;
        let service: ShippingStatusHistoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ShippingStatusHistoryDetailComponent],
                providers: [
                    ShippingStatusHistoryService
                ]
            })
            .overrideTemplate(ShippingStatusHistoryDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ShippingStatusHistoryDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ShippingStatusHistoryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new ShippingStatusHistory(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.shippingStatusHistory).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
