import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAnswerScale, AnswerScale } from '../answer-scale.model';
import { AnswerScaleService } from '../service/answer-scale.service';

@Injectable({ providedIn: 'root' })
export class AnswerScaleRoutingResolveService implements Resolve<IAnswerScale> {
  constructor(protected service: AnswerScaleService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAnswerScale> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((answerScale: HttpResponse<AnswerScale>) => {
          if (answerScale.body) {
            return of(answerScale.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AnswerScale());
  }
}
