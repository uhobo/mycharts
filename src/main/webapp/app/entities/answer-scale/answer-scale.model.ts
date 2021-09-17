import { ISurvey } from 'app/entities/survey/survey.model';

export interface IAnswerScale {
  id?: string;
  score?: number;
  description?: string | null;
  survey?: ISurvey | null;
}

export class AnswerScale implements IAnswerScale {
  constructor(public id?: string, public score?: number, public description?: string | null, public survey?: ISurvey | null) {}
}

export function getAnswerScaleIdentifier(answerScale: IAnswerScale): string | undefined {
  return answerScale.id;
}
