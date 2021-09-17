import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISurveyQuestion } from '../survey-question.model';
import { SurveyQuestionService } from '../service/survey-question.service';

@Component({
  templateUrl: './survey-question-delete-dialog.component.html',
})
export class SurveyQuestionDeleteDialogComponent {
  surveyQuestion?: ISurveyQuestion;

  constructor(protected surveyQuestionService: SurveyQuestionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.surveyQuestionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
