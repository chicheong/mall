/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { Headers } from '@angular/http';

import { MallTestModule } from '../../../test.module';
import { OrderStatusHistoryComponent } from '../../../../../../main/webapp/app/entities/order-status-history/order-status-history.component';
import { OrderStatusHistoryService } from '../../../../../../main/webapp/app/entities/order-status-history/order-status-history.service';
import { OrderStatusHistory } from '../../../../../../main/webapp/app/entities/order-status-history/order-status-history.model';

describe('Component Tests', () => {

    describe('OrderStatusHistory Management Component', () => {
        let comp: OrderStatusHistoryComponent;
        let fixture: ComponentFixture<OrderStatusHistoryComponent>;
        let service: OrderStatusHistoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [OrderStatusHistoryComponent],
                providers: [
                    OrderStatusHistoryService
                ]
            })
            .overrideTemplate(OrderStatusHistoryComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OrderStatusHistoryComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OrderStatusHistoryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new OrderStatusHistory(123)],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.orderStatusHistories[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
