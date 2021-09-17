import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAnswerScale } from '../answer-scale.model';

@Component({
  selector: 'jhi-answer-scale-detail',
  templateUrl: './answer-scale-detail.component.html',
})
export class AnswerScaleDetailComponent implements OnInit {
  answerScale: IAnswerScale | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ answerScale }) => {
      this.answerScale = answerScale;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
