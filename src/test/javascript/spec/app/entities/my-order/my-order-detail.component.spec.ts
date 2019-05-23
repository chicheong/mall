/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { MyOrderDetailComponent } from 'app/entities/my-order/my-order-detail.component';
import { MyOrder } from 'app/shared/model/my-order.model';

describe('Component Tests', () => {
    describe('MyOrder Management Detail Component', () => {
        let comp: MyOrderDetailComponent;
        let fixture: ComponentFixture<MyOrderDetailComponent>;
        const route = ({ data: of({ myOrder: new MyOrder(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [MyOrderDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(MyOrderDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(MyOrderDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.myOrder).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
