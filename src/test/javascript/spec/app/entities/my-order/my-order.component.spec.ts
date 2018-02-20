/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MallTestModule } from '../../../test.module';
import { MyOrderComponent } from '../../../../../../main/webapp/app/entities/my-order/my-order.component';
import { MyOrderService } from '../../../../../../main/webapp/app/entities/my-order/my-order.service';
import { MyOrder } from '../../../../../../main/webapp/app/entities/my-order/my-order.model';

describe('Component Tests', () => {

    describe('MyOrder Management Component', () => {
        let comp: MyOrderComponent;
        let fixture: ComponentFixture<MyOrderComponent>;
        let service: MyOrderService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [MyOrderComponent],
                providers: [
                    MyOrderService
                ]
            })
            .overrideTemplate(MyOrderComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MyOrderComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MyOrderService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new MyOrder(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.myOrders[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
