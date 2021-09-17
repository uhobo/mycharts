jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISurveyQuestion, SurveyQuestion } from '../survey-question.model';
import { SurveyQuestionService } from '../service/survey-question.service';

import { SurveyQuestionRoutingResolveService } from './survey-question-routing-resolve.service';

describe('Service Tests', () => {
  describe('SurveyQuestion routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: SurveyQuestionRoutingResolveService;
    let service: SurveyQuestionService;
    let resultSurveyQuestion: ISurveyQuestion | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(SurveyQuestionRoutingResolveService);
      service = TestBed.inject(SurveyQuestionService);
      resultSurveyQuestion = undefined;
    });

    describe('resolve', () => {
      it('should return ISurveyQuestion returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSurveyQuestion = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultSurveyQuestion).toEqual({ id: 'ABC' });
      });

      it('should return new ISurveyQuestion if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSurveyQuestion = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultSurveyQuestion).toEqual(new SurveyQuestion());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as SurveyQuestion })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSurveyQuestion = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultSurveyQuestion).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
