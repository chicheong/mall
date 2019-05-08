/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MallTestModule } from '../../../test.module';
import { OrderShopComponent } from '../../../../../../main/webapp/app/entities/order-shop/order-shop.component';
import { OrderShopService } from '../../../../../../main/webapp/app/entities/order-shop/order-shop.service';
import { OrderShop } from '../../../../../../main/webapp/app/entities/order-shop/order-shop.model';

describe('Component Tests', () => {

    describe('OrderShop Management Component', () => {
        let comp: OrderShopComponent;
        let fixture: ComponentFixture<OrderShopComponent>;
        let service: OrderShopService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [OrderShopComponent],
                providers: [
                    OrderShopService
                ]
            })
            .overrideTemplate(OrderShopComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OrderShopComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OrderShopService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new OrderShop(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.orderShops[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
