import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SurveyQuestionDetailComponent } from './survey-question-detail.component';

describe('Component Tests', () => {
  describe('SurveyQuestion Management Detail Component', () => {
    let comp: SurveyQuestionDetailComponent;
    let fixture: ComponentFixture<SurveyQuestionDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SurveyQuestionDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ surveyQuestion: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(SurveyQuestionDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SurveyQuestionDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load surveyQuestion on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.surveyQuestion).toEqual(expect.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
