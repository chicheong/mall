/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import { MallTestModule } from '../../../test.module';
import { OrderStatusHistoryDetailComponent } from '../../../../../../main/webapp/app/entities/order-status-history/order-status-history-detail.component';
import { OrderStatusHistoryService } from '../../../../../../main/webapp/app/entities/order-status-history/order-status-history.service';
import { OrderStatusHistory } from '../../../../../../main/webapp/app/entities/order-status-history/order-status-history.model';

describe('Component Tests', () => {

    describe('OrderStatusHistory Management Detail Component', () => {
        let comp: OrderStatusHistoryDetailComponent;
        let fixture: ComponentFixture<OrderStatusHistoryDetailComponent>;
        let service: OrderStatusHistoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [OrderStatusHistoryDetailComponent],
                providers: [
                    OrderStatusHistoryService
                ]
            })
            .overrideTemplate(OrderStatusHistoryDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OrderStatusHistoryDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OrderStatusHistoryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new OrderStatusHistory(123)));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.orderStatusHistory).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
