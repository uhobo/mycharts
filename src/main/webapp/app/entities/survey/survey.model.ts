import { IAnswerScale } from 'app/entities/answer-scale/answer-scale.model';
import { ISurveyQuestion } from 'app/entities/survey-question/survey-question.model';

export interface ISurvey {
  id?: string;
  title?: string;
  description?: string | null;
  scaleLists?: IAnswerScale[] | null;
  questionLists?: ISurveyQuestion[] | null;
}

export class Survey implements ISurvey {
  constructor(
    public id?: string,
    public title?: string,
    public description?: string | null,
    public scaleLists?: IAnswerScale[] | null,
    public questionLists?: ISurveyQuestion[] | null
  ) {}
}

export function getSurveyIdentifier(survey: ISurvey): string | undefined {
  return survey.id;
}
