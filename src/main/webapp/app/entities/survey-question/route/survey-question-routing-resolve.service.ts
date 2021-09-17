import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISurveyQuestion, SurveyQuestion } from '../survey-question.model';
import { SurveyQuestionService } from '../service/survey-question.service';

@Injectable({ providedIn: 'root' })
export class SurveyQuestionRoutingResolveService implements Resolve<ISurveyQuestion> {
  constructor(protected service: SurveyQuestionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISurveyQuestion> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((surveyQuestion: HttpResponse<SurveyQuestion>) => {
          if (surveyQuestion.body) {
            return of(surveyQuestion.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SurveyQuestion());
  }
}
