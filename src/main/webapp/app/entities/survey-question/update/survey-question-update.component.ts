import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISurveyQuestion, SurveyQuestion } from '../survey-question.model';
import { SurveyQuestionService } from '../service/survey-question.service';
import { ISurvey } from 'app/entities/survey/survey.model';
import { SurveyService } from 'app/entities/survey/service/survey.service';

@Component({
  selector: 'jhi-survey-question-update',
  templateUrl: './survey-question-update.component.html',
})
export class SurveyQuestionUpdateComponent implements OnInit {
  isSaving = false;

  surveysSharedCollection: ISurvey[] = [];

  editForm = this.fb.group({
    id: [],
    questionId: [null, [Validators.required]],
    description: [null, [Validators.required]],
    survey: [],
  });

  constructor(
    protected surveyQuestionService: SurveyQuestionService,
    protected surveyService: SurveyService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ surveyQuestion }) => {
      this.updateForm(surveyQuestion);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const surveyQuestion = this.createFromForm();
    if (surveyQuestion.id !== undefined) {
      this.subscribeToSaveResponse(this.surveyQuestionService.update(surveyQuestion));
    } else {
      this.subscribeToSaveResponse(this.surveyQuestionService.create(surveyQuestion));
    }
  }

  trackSurveyById(index: number, item: ISurvey): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISurveyQuestion>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(surveyQuestion: ISurveyQuestion): void {
    this.editForm.patchValue({
      id: surveyQuestion.id,
      questionId: surveyQuestion.questionId,
      description: surveyQuestion.description,
      survey: surveyQuestion.survey,
    });

    this.surveysSharedCollection = this.surveyService.addSurveyToCollectionIfMissing(this.surveysSharedCollection, surveyQuestion.survey);
  }

  protected loadRelationshipsOptions(): void {
    this.surveyService
      .query()
      .pipe(map((res: HttpResponse<ISurvey[]>) => res.body ?? []))
      .pipe(map((surveys: ISurvey[]) => this.surveyService.addSurveyToCollectionIfMissing(surveys, this.editForm.get('survey')!.value)))
      .subscribe((surveys: ISurvey[]) => (this.surveysSharedCollection = surveys));
  }

  protected createFromForm(): ISurveyQuestion {
    return {
      ...new SurveyQuestion(),
      id: this.editForm.get(['id'])!.value,
      questionId: this.editForm.get(['questionId'])!.value,
      description: this.editForm.get(['description'])!.value,
      survey: this.editForm.get(['survey'])!.value,
    };
  }
}
