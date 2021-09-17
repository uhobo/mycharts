import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SurveyQuestionService } from '../service/survey-question.service';

import { SurveyQuestionComponent } from './survey-question.component';

describe('Component Tests', () => {
  describe('SurveyQuestion Management Component', () => {
    let comp: SurveyQuestionComponent;
    let fixture: ComponentFixture<SurveyQuestionComponent>;
    let service: SurveyQuestionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SurveyQuestionComponent],
      })
        .overrideTemplate(SurveyQuestionComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SurveyQuestionComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(SurveyQuestionService);

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
      expect(comp.surveyQuestions?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
