import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAnswerScale, AnswerScale } from '../answer-scale.model';
import { AnswerScaleService } from '../service/answer-scale.service';
import { ISurvey } from 'app/entities/survey/survey.model';
import { SurveyService } from 'app/entities/survey/service/survey.service';

@Component({
  selector: 'jhi-answer-scale-update',
  templateUrl: './answer-scale-update.component.html',
})
export class AnswerScaleUpdateComponent implements OnInit {
  isSaving = false;

  surveysSharedCollection: ISurvey[] = [];

  editForm = this.fb.group({
    id: [],
    score: [null, [Validators.required]],
    description: [],
    survey: [],
  });

  constructor(
    protected answerScaleService: AnswerScaleService,
    protected surveyService: SurveyService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ answerScale }) => {
      this.updateForm(answerScale);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const answerScale = this.createFromForm();
    if (answerScale.id !== undefined) {
      this.subscribeToSaveResponse(this.answerScaleService.update(answerScale));
    } else {
      this.subscribeToSaveResponse(this.answerScaleService.create(answerScale));
    }
  }

  trackSurveyById(index: number, item: ISurvey): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAnswerScale>>): void {
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

  protected updateForm(answerScale: IAnswerScale): void {
    this.editForm.patchValue({
      id: answerScale.id,
      score: answerScale.score,
      description: answerScale.description,
      survey: answerScale.survey,
    });

    this.surveysSharedCollection = this.surveyService.addSurveyToCollectionIfMissing(this.surveysSharedCollection, answerScale.survey);
  }

  protected loadRelationshipsOptions(): void {
    this.surveyService
      .query()
      .pipe(map((res: HttpResponse<ISurvey[]>) => res.body ?? []))
      .pipe(map((surveys: ISurvey[]) => this.surveyService.addSurveyToCollectionIfMissing(surveys, this.editForm.get('survey')!.value)))
      .subscribe((surveys: ISurvey[]) => (this.surveysSharedCollection = surveys));
  }

  protected createFromForm(): IAnswerScale {
    return {
      ...new AnswerScale(),
      id: this.editForm.get(['id'])!.value,
      score: this.editForm.get(['score'])!.value,
      description: this.editForm.get(['description'])!.value,
      survey: this.editForm.get(['survey'])!.value,
    };
  }
}
