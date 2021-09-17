import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAnswerScale } from '../answer-scale.model';
import { AnswerScaleService } from '../service/answer-scale.service';
import { AnswerScaleDeleteDialogComponent } from '../delete/answer-scale-delete-dialog.component';

@Component({
  selector: 'jhi-answer-scale',
  templateUrl: './answer-scale.component.html',
})
export class AnswerScaleComponent implements OnInit {
  answerScales?: IAnswerScale[];
  isLoading = false;

  constructor(protected answerScaleService: AnswerScaleService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.answerScaleService.query().subscribe(
      (res: HttpResponse<IAnswerScale[]>) => {
        this.isLoading = false;
        this.answerScales = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAnswerScale): string {
    return item.id!;
  }

  delete(answerScale: IAnswerScale): void {
    const modalRef = this.modalService.open(AnswerScaleDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.answerScale = answerScale;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
