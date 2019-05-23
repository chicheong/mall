/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { MyOrderService } from 'app/entities/my-order/my-order.service';
import { IMyOrder, MyOrder, CurrencyType, OrderStatus } from 'app/shared/model/my-order.model';

describe('Service Tests', () => {
    describe('MyOrder Service', () => {
        let injector: TestBed;
        let service: MyOrderService;
        let httpMock: HttpTestingController;
        let elemDefault: IMyOrder;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(MyOrderService);
            httpMock = injector.get(HttpTestingController);

            elemDefault = new MyOrder(0, 'AAAAAAA', 0, CurrencyType.HKD, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', OrderStatus.PENDING);
        });

        describe('Service methods', async () => {
            it('should find an element', async () => {
                const returnedFromService = Object.assign({}, elemDefault);
                service
                    .find(123)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: elemDefault }));

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should create a MyOrder', async () => {
                const returnedFromService = Object.assign(
                    {
                        id: 0
                    },
                    elemDefault
                );
                const expected = Object.assign({}, returnedFromService);
                service
                    .create(new MyOrder(null))
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'POST' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should update a MyOrder', async () => {
                const returnedFromService = Object.assign(
                    {
                        receiver: 'BBBBBB',
                        total: 1,
                        currency: 'BBBBBB',
                        contactNum: 'BBBBBB',
                        email: 'BBBBBB',
                        remark: 'BBBBBB',
                        status: 'BBBBBB'
                    },
                    elemDefault
                );

                const expected = Object.assign({}, returnedFromService);
                service
                    .update(expected)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'PUT' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should return a list of MyOrder', async () => {
                const returnedFromService = Object.assign(
                    {
                        receiver: 'BBBBBB',
                        total: 1,
                        currency: 'BBBBBB',
                        contactNum: 'BBBBBB',
                        email: 'BBBBBB',
                        remark: 'BBBBBB',
                        status: 'BBBBBB'
                    },
                    elemDefault
                );
                const expected = Object.assign({}, returnedFromService);
                service
                    .query(expected)
                    .pipe(
                        take(1),
                        map(resp => resp.body)
                    )
                    .subscribe(body => expect(body).toContainEqual(expected));
                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify([returnedFromService]));
                httpMock.verify();
            });

            it('should delete a MyOrder', async () => {
                const rxPromise = service.delete(123).subscribe(resp => expect(resp.ok));

                const req = httpMock.expectOne({ method: 'DELETE' });
                req.flush({ status: 200 });
            });
        });

        afterEach(() => {
            httpMock.verify();
        });
    });
});
