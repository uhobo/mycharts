import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAnswerScale, getAnswerScaleIdentifier } from '../answer-scale.model';

export type EntityResponseType = HttpResponse<IAnswerScale>;
export type EntityArrayResponseType = HttpResponse<IAnswerScale[]>;

@Injectable({ providedIn: 'root' })
export class AnswerScaleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/answer-scales');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(answerScale: IAnswerScale): Observable<EntityResponseType> {
    return this.http.post<IAnswerScale>(this.resourceUrl, answerScale, { observe: 'response' });
  }

  update(answerScale: IAnswerScale): Observable<EntityResponseType> {
    return this.http.put<IAnswerScale>(`${this.resourceUrl}/${getAnswerScaleIdentifier(answerScale) as string}`, answerScale, {
      observe: 'response',
    });
  }

  partialUpdate(answerScale: IAnswerScale): Observable<EntityResponseType> {
    return this.http.patch<IAnswerScale>(`${this.resourceUrl}/${getAnswerScaleIdentifier(answerScale) as string}`, answerScale, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IAnswerScale>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAnswerScale[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAnswerScaleToCollectionIfMissing(
    answerScaleCollection: IAnswerScale[],
    ...answerScalesToCheck: (IAnswerScale | null | undefined)[]
  ): IAnswerScale[] {
    const answerScales: IAnswerScale[] = answerScalesToCheck.filter(isPresent);
    if (answerScales.length > 0) {
      const answerScaleCollectionIdentifiers = answerScaleCollection.map(answerScaleItem => getAnswerScaleIdentifier(answerScaleItem)!);
      const answerScalesToAdd = answerScales.filter(answerScaleItem => {
        const answerScaleIdentifier = getAnswerScaleIdentifier(answerScaleItem);
        if (answerScaleIdentifier == null || answerScaleCollectionIdentifiers.includes(answerScaleIdentifier)) {
          return false;
        }
        answerScaleCollectionIdentifiers.push(answerScaleIdentifier);
        return true;
      });
      return [...answerScalesToAdd, ...answerScaleCollection];
    }
    return answerScaleCollection;
  }
}
