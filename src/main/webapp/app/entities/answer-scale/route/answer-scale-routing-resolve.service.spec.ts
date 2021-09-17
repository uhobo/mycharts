jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IAnswerScale, AnswerScale } from '../answer-scale.model';
import { AnswerScaleService } from '../service/answer-scale.service';

import { AnswerScaleRoutingResolveService } from './answer-scale-routing-resolve.service';

describe('Service Tests', () => {
  describe('AnswerScale routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: AnswerScaleRoutingResolveService;
    let service: AnswerScaleService;
    let resultAnswerScale: IAnswerScale | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(AnswerScaleRoutingResolveService);
      service = TestBed.inject(AnswerScaleService);
      resultAnswerScale = undefined;
    });

    describe('resolve', () => {
      it('should return IAnswerScale returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAnswerScale = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultAnswerScale).toEqual({ id: 'ABC' });
      });

      it('should return new IAnswerScale if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAnswerScale = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultAnswerScale).toEqual(new AnswerScale());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as AnswerScale })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAnswerScale = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultAnswerScale).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
