import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISurveyQuestion, getSurveyQuestionIdentifier } from '../survey-question.model';

export type EntityResponseType = HttpResponse<ISurveyQuestion>;
export type EntityArrayResponseType = HttpResponse<ISurveyQuestion[]>;

@Injectable({ providedIn: 'root' })
export class SurveyQuestionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/survey-questions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(surveyQuestion: ISurveyQuestion): Observable<EntityResponseType> {
    return this.http.post<ISurveyQuestion>(this.resourceUrl, surveyQuestion, { observe: 'response' });
  }

  update(surveyQuestion: ISurveyQuestion): Observable<EntityResponseType> {
    return this.http.put<ISurveyQuestion>(`${this.resourceUrl}/${getSurveyQuestionIdentifier(surveyQuestion) as string}`, surveyQuestion, {
      observe: 'response',
    });
  }

  partialUpdate(surveyQuestion: ISurveyQuestion): Observable<EntityResponseType> {
    return this.http.patch<ISurveyQuestion>(
      `${this.resourceUrl}/${getSurveyQuestionIdentifier(surveyQuestion) as string}`,
      surveyQuestion,
      { observe: 'response' }
    );
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ISurveyQuestion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISurveyQuestion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSurveyQuestionToCollectionIfMissing(
    surveyQuestionCollection: ISurveyQuestion[],
    ...surveyQuestionsToCheck: (ISurveyQuestion | null | undefined)[]
  ): ISurveyQuestion[] {
    const surveyQuestions: ISurveyQuestion[] = surveyQuestionsToCheck.filter(isPresent);
    if (surveyQuestions.length > 0) {
      const surveyQuestionCollectionIdentifiers = surveyQuestionCollection.map(
        surveyQuestionItem => getSurveyQuestionIdentifier(surveyQuestionItem)!
      );
      const surveyQuestionsToAdd = surveyQuestions.filter(surveyQuestionItem => {
        const surveyQuestionIdentifier = getSurveyQuestionIdentifier(surveyQuestionItem);
        if (surveyQuestionIdentifier == null || surveyQuestionCollectionIdentifiers.includes(surveyQuestionIdentifier)) {
          return false;
        }
        surveyQuestionCollectionIdentifiers.push(surveyQuestionIdentifier);
        return true;
      });
      return [...surveyQuestionsToAdd, ...surveyQuestionCollection];
    }
    return surveyQuestionCollection;
  }
}
