jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SurveyService } from '../service/survey.service';
import { ISurvey, Survey } from '../survey.model';

import { SurveyUpdateComponent } from './survey-update.component';

describe('Component Tests', () => {
  describe('Survey Management Update Component', () => {
    let comp: SurveyUpdateComponent;
    let fixture: ComponentFixture<SurveyUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let surveyService: SurveyService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SurveyUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SurveyUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SurveyUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      surveyService = TestBed.inject(SurveyService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const survey: ISurvey = { id: 'CBA' };

        activatedRoute.data = of({ survey });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(survey));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Survey>>();
        const survey = { id: 'ABC' };
        jest.spyOn(surveyService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ survey });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: survey }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(surveyService.update).toHaveBeenCalledWith(survey);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Survey>>();
        const survey = new Survey();
        jest.spyOn(surveyService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ survey });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: survey }));
        saveSubject.complete();

        // THEN
        expect(surveyService.create).toHaveBeenCalledWith(survey);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Survey>>();
        const survey = { id: 'ABC' };
        jest.spyOn(surveyService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ survey });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(surveyService.update).toHaveBeenCalledWith(survey);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
