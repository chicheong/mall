/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MallTestModule } from '../../../test.module';
import { UrlComponent } from '../../../../../../main/webapp/app/entities/url/url.component';
import { UrlService } from '../../../../../../main/webapp/app/entities/url/url.service';
import { Url } from '../../../../../../main/webapp/app/entities/url/url.model';

describe('Component Tests', () => {

    describe('Url Management Component', () => {
        let comp: UrlComponent;
        let fixture: ComponentFixture<UrlComponent>;
        let service: UrlService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [UrlComponent],
                providers: [
                    UrlService
                ]
            })
            .overrideTemplate(UrlComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(UrlComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(UrlService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Url(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.urls[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
