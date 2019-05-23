/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { OrderShopDetailComponent } from 'app/entities/order-shop/order-shop-detail.component';
import { OrderShop } from 'app/shared/model/order-shop.model';

describe('Component Tests', () => {
    describe('OrderShop Management Detail Component', () => {
        let comp: OrderShopDetailComponent;
        let fixture: ComponentFixture<OrderShopDetailComponent>;
        const route = ({ data: of({ orderShop: new OrderShop(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [OrderShopDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(OrderShopDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(OrderShopDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.orderShop).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
