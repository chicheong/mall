/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { MallTestModule } from '../../../test.module';
import { UrlDetailComponent } from '../../../../../../main/webapp/app/entities/url/url-detail.component';
import { UrlService } from '../../../../../../main/webapp/app/entities/url/url.service';
import { Url } from '../../../../../../main/webapp/app/entities/url/url.model';

describe('Component Tests', () => {

    describe('Url Management Detail Component', () => {
        let comp: UrlDetailComponent;
        let fixture: ComponentFixture<UrlDetailComponent>;
        let service: UrlService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [UrlDetailComponent],
                providers: [
                    UrlService
                ]
            })
            .overrideTemplate(UrlDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(UrlDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(UrlService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Url(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.url).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
