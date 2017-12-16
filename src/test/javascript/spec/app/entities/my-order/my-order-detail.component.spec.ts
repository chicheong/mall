/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MallTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { MyOrderDetailComponent } from '../../../../../../main/webapp/app/entities/my-order/my-order-detail.component';
import { MyOrderService } from '../../../../../../main/webapp/app/entities/my-order/my-order.service';
import { MyOrder } from '../../../../../../main/webapp/app/entities/my-order/my-order.model';

describe('Component Tests', () => {

    describe('MyOrder Management Detail Component', () => {
        let comp: MyOrderDetailComponent;
        let fixture: ComponentFixture<MyOrderDetailComponent>;
        let service: MyOrderService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [MyOrderDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    MyOrderService,
                    JhiEventManager
                ]
            }).overrideTemplate(MyOrderDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MyOrderDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MyOrderService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new MyOrder(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.myOrder).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
