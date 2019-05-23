/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { ProductHistoryService } from 'app/entities/product-history/product-history.service';
import { IProductHistory, ProductHistory, ProductStatus } from 'app/shared/model/product-history.model';

describe('Service Tests', () => {
    describe('ProductHistory Service', () => {
        let injector: TestBed;
        let service: ProductHistoryService;
        let httpMock: HttpTestingController;
        let elemDefault: IProductHistory;
        let currentDate: moment.Moment;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(ProductHistoryService);
            httpMock = injector.get(HttpTestingController);
            currentDate = moment();

            elemDefault = new ProductHistory(
                0,
                0,
                'AAAAAAA',
                'AAAAAAA',
                'AAAAAAA',
                'AAAAAAA',
                'AAAAAAA',
                'AAAAAAA',
                ProductStatus.ACTIVE,
                'AAAAAAA',
                currentDate
            );
        });

        describe('Service methods', async () => {
            it('should find an element', async () => {
                const returnedFromService = Object.assign(
                    {
                        createdDate: currentDate.format(DATE_TIME_FORMAT)
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

            it('should create a ProductHistory', async () => {
                const returnedFromService = Object.assign(
                    {
                        id: 0,
                        createdDate: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        createdDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .create(new ProductHistory(null))
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'POST' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should update a ProductHistory', async () => {
                const returnedFromService = Object.assign(
                    {
                        productId: 1,
                        name: 'BBBBBB',
                        code: 'BBBBBB',
                        brand: 'BBBBBB',
                        description: 'BBBBBB',
                        content: 'BBBBBB',
                        remark: 'BBBBBB',
                        status: 'BBBBBB',
                        createdBy: 'BBBBBB',
                        createdDate: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );

                const expected = Object.assign(
                    {
                        createdDate: currentDate
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

            it('should return a list of ProductHistory', async () => {
                const returnedFromService = Object.assign(
                    {
                        productId: 1,
                        name: 'BBBBBB',
                        code: 'BBBBBB',
                        brand: 'BBBBBB',
                        description: 'BBBBBB',
                        content: 'BBBBBB',
                        remark: 'BBBBBB',
                        status: 'BBBBBB',
                        createdBy: 'BBBBBB',
                        createdDate: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        createdDate: currentDate
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

            it('should delete a ProductHistory', async () => {
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
