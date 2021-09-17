import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISurveyQuestion } from '../survey-question.model';
import { SurveyQuestionService } from '../service/survey-question.service';
import { SurveyQuestionDeleteDialogComponent } from '../delete/survey-question-delete-dialog.component';

@Component({
  selector: 'jhi-survey-question',
  templateUrl: './survey-question.component.html',
})
export class SurveyQuestionComponent implements OnInit {
  surveyQuestions?: ISurveyQuestion[];
  isLoading = false;

  constructor(protected surveyQuestionService: SurveyQuestionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.surveyQuestionService.query().subscribe(
      (res: HttpResponse<ISurveyQuestion[]>) => {
        this.isLoading = false;
        this.surveyQuestions = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISurveyQuestion): string {
    return item.id!;
  }

  delete(surveyQuestion: ISurveyQuestion): void {
    const modalRef = this.modalService.open(SurveyQuestionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.surveyQuestion = surveyQuestion;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
