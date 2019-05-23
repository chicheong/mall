/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { UrlDetailComponent } from 'app/entities/url/url-detail.component';
import { Url } from 'app/shared/model/url.model';

describe('Component Tests', () => {
    describe('Url Management Detail Component', () => {
        let comp: UrlDetailComponent;
        let fixture: ComponentFixture<UrlDetailComponent>;
        const route = ({ data: of({ url: new Url(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [UrlDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(UrlDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(UrlDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.url).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
