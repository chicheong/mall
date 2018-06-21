/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MallTestModule } from '../../../test.module';
import { ShippingStatusHistoryComponent } from '../../../../../../main/webapp/app/entities/shipping-status-history/shipping-status-history.component';
import { ShippingStatusHistoryService } from '../../../../../../main/webapp/app/entities/shipping-status-history/shipping-status-history.service';
import { ShippingStatusHistory } from '../../../../../../main/webapp/app/entities/shipping-status-history/shipping-status-history.model';

describe('Component Tests', () => {

    describe('ShippingStatusHistory Management Component', () => {
        let comp: ShippingStatusHistoryComponent;
        let fixture: ComponentFixture<ShippingStatusHistoryComponent>;
        let service: ShippingStatusHistoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ShippingStatusHistoryComponent],
                providers: [
                    ShippingStatusHistoryService
                ]
            })
            .overrideTemplate(ShippingStatusHistoryComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ShippingStatusHistoryComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ShippingStatusHistoryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new ShippingStatusHistory(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.shippingStatusHistories[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
