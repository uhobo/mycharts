import { ISurvey } from 'app/entities/survey/survey.model';

export interface ISurveyQuestion {
  id?: string;
  questionId?: number;
  description?: string;
  survey?: ISurvey | null;
}

export class SurveyQuestion implements ISurveyQuestion {
  constructor(public id?: string, public questionId?: number, public description?: string, public survey?: ISurvey | null) {}
}

export function getSurveyQuestionIdentifier(surveyQuestion: ISurveyQuestion): string | undefined {
  return surveyQuestion.id;
}
