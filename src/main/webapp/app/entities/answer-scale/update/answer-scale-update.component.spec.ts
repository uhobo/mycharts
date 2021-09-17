jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AnswerScaleService } from '../service/answer-scale.service';
import { IAnswerScale, AnswerScale } from '../answer-scale.model';
import { ISurvey } from 'app/entities/survey/survey.model';
import { SurveyService } from 'app/entities/survey/service/survey.service';

import { AnswerScaleUpdateComponent } from './answer-scale-update.component';

describe('Component Tests', () => {
  describe('AnswerScale Management Update Component', () => {
    let comp: AnswerScaleUpdateComponent;
    let fixture: ComponentFixture<AnswerScaleUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let answerScaleService: AnswerScaleService;
    let surveyService: SurveyService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AnswerScaleUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AnswerScaleUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AnswerScaleUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      answerScaleService = TestBed.inject(AnswerScaleService);
      surveyService = TestBed.inject(SurveyService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Survey query and add missing value', () => {
        const answerScale: IAnswerScale = { id: 'CBA' };
        const survey: ISurvey = { id: '6187b514-d1e5-4eab-b68a-a435aa1c9179' };
        answerScale.survey = survey;

        const surveyCollection: ISurvey[] = [{ id: '0b447853-d1f7-4318-9943-477aea7cd7dc' }];
        jest.spyOn(surveyService, 'query').mockReturnValue(of(new HttpResponse({ body: surveyCollection })));
        const additionalSurveys = [survey];
        const expectedCollection: ISurvey[] = [...additionalSurveys, ...surveyCollection];
        jest.spyOn(surveyService, 'addSurveyToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ answerScale });
        comp.ngOnInit();

        expect(surveyService.query).toHaveBeenCalled();
        expect(surveyService.addSurveyToCollectionIfMissing).toHaveBeenCalledWith(surveyCollection, ...additionalSurveys);
        expect(comp.surveysSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const answerScale: IAnswerScale = { id: 'CBA' };
        const survey: ISurvey = { id: '172415ad-89f2-477d-a58f-598942d16866' };
        answerScale.survey = survey;

        activatedRoute.data = of({ answerScale });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(answerScale));
        expect(comp.surveysSharedCollection).toContain(survey);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<AnswerScale>>();
        const answerScale = { id: 'ABC' };
        jest.spyOn(answerScaleService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ answerScale });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: answerScale }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(answerScaleService.update).toHaveBeenCalledWith(answerScale);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<AnswerScale>>();
        const answerScale = new AnswerScale();
        jest.spyOn(answerScaleService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ answerScale });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: answerScale }));
        saveSubject.complete();

        // THEN
        expect(answerScaleService.create).toHaveBeenCalledWith(answerScale);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<AnswerScale>>();
        const answerScale = { id: 'ABC' };
        jest.spyOn(answerScaleService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ answerScale });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(answerScaleService.update).toHaveBeenCalledWith(answerScale);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackSurveyById', () => {
        it('Should return tracked Survey primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackSurveyById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
