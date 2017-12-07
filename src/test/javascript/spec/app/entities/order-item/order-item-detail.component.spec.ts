/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MallTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { OrderItemDetailComponent } from '../../../../../../main/webapp/app/entities/order-item/order-item-detail.component';
import { OrderItemService } from '../../../../../../main/webapp/app/entities/order-item/order-item.service';
import { OrderItem } from '../../../../../../main/webapp/app/entities/order-item/order-item.model';

describe('Component Tests', () => {

    describe('OrderItem Management Detail Component', () => {
        let comp: OrderItemDetailComponent;
        let fixture: ComponentFixture<OrderItemDetailComponent>;
        let service: OrderItemService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [OrderItemDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    OrderItemService,
                    JhiEventManager
                ]
            }).overrideTemplate(OrderItemDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OrderItemDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OrderItemService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new OrderItem(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.orderItem).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
