jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SurveyQuestionService } from '../service/survey-question.service';
import { ISurveyQuestion, SurveyQuestion } from '../survey-question.model';
import { ISurvey } from 'app/entities/survey/survey.model';
import { SurveyService } from 'app/entities/survey/service/survey.service';

import { SurveyQuestionUpdateComponent } from './survey-question-update.component';

describe('Component Tests', () => {
  describe('SurveyQuestion Management Update Component', () => {
    let comp: SurveyQuestionUpdateComponent;
    let fixture: ComponentFixture<SurveyQuestionUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let surveyQuestionService: SurveyQuestionService;
    let surveyService: SurveyService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SurveyQuestionUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SurveyQuestionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SurveyQuestionUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      surveyQuestionService = TestBed.inject(SurveyQuestionService);
      surveyService = TestBed.inject(SurveyService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Survey query and add missing value', () => {
        const surveyQuestion: ISurveyQuestion = { id: 'CBA' };
        const survey: ISurvey = { id: 'd404cf2d-08b5-4540-8e1e-47bf43875074' };
        surveyQuestion.survey = survey;

        const surveyCollection: ISurvey[] = [{ id: 'cbe9b021-67c9-4fb8-83d9-a5a3eb6c9727' }];
        jest.spyOn(surveyService, 'query').mockReturnValue(of(new HttpResponse({ body: surveyCollection })));
        const additionalSurveys = [survey];
        const expectedCollection: ISurvey[] = [...additionalSurveys, ...surveyCollection];
        jest.spyOn(surveyService, 'addSurveyToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ surveyQuestion });
        comp.ngOnInit();

        expect(surveyService.query).toHaveBeenCalled();
        expect(surveyService.addSurveyToCollectionIfMissing).toHaveBeenCalledWith(surveyCollection, ...additionalSurveys);
        expect(comp.surveysSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const surveyQuestion: ISurveyQuestion = { id: 'CBA' };
        const survey: ISurvey = { id: '1194ef1b-c4a8-4f99-824a-d29335233833' };
        surveyQuestion.survey = survey;

        activatedRoute.data = of({ surveyQuestion });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(surveyQuestion));
        expect(comp.surveysSharedCollection).toContain(survey);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<SurveyQuestion>>();
        const surveyQuestion = { id: 'ABC' };
        jest.spyOn(surveyQuestionService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ surveyQuestion });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: surveyQuestion }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(surveyQuestionService.update).toHaveBeenCalledWith(surveyQuestion);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<SurveyQuestion>>();
        const surveyQuestion = new SurveyQuestion();
        jest.spyOn(surveyQuestionService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ surveyQuestion });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: surveyQuestion }));
        saveSubject.complete();

        // THEN
        expect(surveyQuestionService.create).toHaveBeenCalledWith(surveyQuestion);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<SurveyQuestion>>();
        const surveyQuestion = { id: 'ABC' };
        jest.spyOn(surveyQuestionService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ surveyQuestion });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(surveyQuestionService.update).toHaveBeenCalledWith(surveyQuestion);
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
