import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { ContactDetailComponent } from 'app/entities/contact/contact-detail.component';
import { Contact } from 'app/shared/model/contact.model';

describe('Component Tests', () => {
  describe('Contact Management Detail Component', () => {
    let comp: ContactDetailComponent;
    let fixture: ComponentFixture<ContactDetailComponent>;
    const route = ({ data: of({ contact: new Contact(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [ContactDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ContactDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ContactDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load contact on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.contact).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
