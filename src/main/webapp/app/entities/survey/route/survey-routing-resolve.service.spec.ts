jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISurvey, Survey } from '../survey.model';
import { SurveyService } from '../service/survey.service';

import { SurveyRoutingResolveService } from './survey-routing-resolve.service';

describe('Service Tests', () => {
  describe('Survey routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: SurveyRoutingResolveService;
    let service: SurveyService;
    let resultSurvey: ISurvey | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(SurveyRoutingResolveService);
      service = TestBed.inject(SurveyService);
      resultSurvey = undefined;
    });

    describe('resolve', () => {
      it('should return ISurvey returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSurvey = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultSurvey).toEqual({ id: 'ABC' });
      });

      it('should return new ISurvey if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSurvey = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultSurvey).toEqual(new Survey());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Survey })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSurvey = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultSurvey).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
