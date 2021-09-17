import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AnswerScaleService } from '../service/answer-scale.service';

import { AnswerScaleComponent } from './answer-scale.component';

describe('Component Tests', () => {
  describe('AnswerScale Management Component', () => {
    let comp: AnswerScaleComponent;
    let fixture: ComponentFixture<AnswerScaleComponent>;
    let service: AnswerScaleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AnswerScaleComponent],
      })
        .overrideTemplate(AnswerScaleComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AnswerScaleComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AnswerScaleService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 'ABC' }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.answerScales?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
