/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { MallTestModule } from '../../../test.module';
import { OrderShopDetailComponent } from '../../../../../../main/webapp/app/entities/order-shop/order-shop-detail.component';
import { OrderShopService } from '../../../../../../main/webapp/app/entities/order-shop/order-shop.service';
import { OrderShop } from '../../../../../../main/webapp/app/entities/order-shop/order-shop.model';

describe('Component Tests', () => {

    describe('OrderShop Management Detail Component', () => {
        let comp: OrderShopDetailComponent;
        let fixture: ComponentFixture<OrderShopDetailComponent>;
        let service: OrderShopService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [OrderShopDetailComponent],
                providers: [
                    OrderShopService
                ]
            })
            .overrideTemplate(OrderShopDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OrderShopDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OrderShopService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new OrderShop(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.orderShop).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
