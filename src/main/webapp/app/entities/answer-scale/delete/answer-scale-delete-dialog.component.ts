import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAnswerScale } from '../answer-scale.model';
import { AnswerScaleService } from '../service/answer-scale.service';

@Component({
  templateUrl: './answer-scale-delete-dialog.component.html',
})
export class AnswerScaleDeleteDialogComponent {
  answerScale?: IAnswerScale;

  constructor(protected answerScaleService: AnswerScaleService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.answerScaleService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
