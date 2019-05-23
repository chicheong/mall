/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { PriceService } from 'app/entities/price/price.service';
import { IPrice, Price, CurrencyType } from 'app/shared/model/price.model';

describe('Service Tests', () => {
    describe('Price Service', () => {
        let injector: TestBed;
        let service: PriceService;
        let httpMock: HttpTestingController;
        let elemDefault: IPrice;
        let currentDate: moment.Moment;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(PriceService);
            httpMock = injector.get(HttpTestingController);
            currentDate = moment();

            elemDefault = new Price(0, currentDate, currentDate, 0, CurrencyType.HKD);
        });

        describe('Service methods', async () => {
            it('should find an element', async () => {
                const returnedFromService = Object.assign(
                    {
                        from: currentDate.format(DATE_TIME_FORMAT),
                        to: currentDate.format(DATE_TIME_FORMAT)
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

            it('should create a Price', async () => {
                const returnedFromService = Object.assign(
                    {
                        id: 0,
                        from: currentDate.format(DATE_TIME_FORMAT),
                        to: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        from: currentDate,
                        to: currentDate
                    },
                    returnedFromService
                );
                service
                    .create(new Price(null))
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'POST' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should update a Price', async () => {
                const returnedFromService = Object.assign(
                    {
                        from: currentDate.format(DATE_TIME_FORMAT),
                        to: currentDate.format(DATE_TIME_FORMAT),
                        price: 1,
                        currency: 'BBBBBB'
                    },
                    elemDefault
                );

                const expected = Object.assign(
                    {
                        from: currentDate,
                        to: currentDate
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

            it('should return a list of Price', async () => {
                const returnedFromService = Object.assign(
                    {
                        from: currentDate.format(DATE_TIME_FORMAT),
                        to: currentDate.format(DATE_TIME_FORMAT),
                        price: 1,
                        currency: 'BBBBBB'
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        from: currentDate,
                        to: currentDate
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

            it('should delete a Price', async () => {
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
