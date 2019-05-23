/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { OrderStatusHistoryService } from 'app/entities/order-status-history/order-status-history.service';
import { IOrderStatusHistory, OrderStatusHistory, OrderStatus } from 'app/shared/model/order-status-history.model';

describe('Service Tests', () => {
    describe('OrderStatusHistory Service', () => {
        let injector: TestBed;
        let service: OrderStatusHistoryService;
        let httpMock: HttpTestingController;
        let elemDefault: IOrderStatusHistory;
        let currentDate: moment.Moment;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(OrderStatusHistoryService);
            httpMock = injector.get(HttpTestingController);
            currentDate = moment();

            elemDefault = new OrderStatusHistory(0, currentDate, OrderStatus.PENDING);
        });

        describe('Service methods', async () => {
            it('should find an element', async () => {
                const returnedFromService = Object.assign(
                    {
                        effectiveDate: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                service
                    .find(123)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: elemDefault }));

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should create a OrderStatusHistory', async () => {
                const returnedFromService = Object.assign(
                    {
                        id: 0,
                        effectiveDate: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        effectiveDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .create(new OrderStatusHistory(null))
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'POST' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should update a OrderStatusHistory', async () => {
                const returnedFromService = Object.assign(
                    {
                        effectiveDate: currentDate.format(DATE_TIME_FORMAT),
                        status: 'BBBBBB'
                    },
                    elemDefault
                );

                const expected = Object.assign(
                    {
                        effectiveDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .update(expected)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'PUT' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should return a list of OrderStatusHistory', async () => {
                const returnedFromService = Object.assign(
                    {
                        effectiveDate: currentDate.format(DATE_TIME_FORMAT),
                        status: 'BBBBBB'
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        effectiveDate: currentDate
                    },
                    returnedFromService
                );
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

            it('should delete a OrderStatusHistory', async () => {
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
