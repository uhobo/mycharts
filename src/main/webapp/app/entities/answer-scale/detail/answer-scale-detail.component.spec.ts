import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AnswerScaleDetailComponent } from './answer-scale-detail.component';

describe('Component Tests', () => {
  describe('AnswerScale Management Detail Component', () => {
    let comp: AnswerScaleDetailComponent;
    let fixture: ComponentFixture<AnswerScaleDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AnswerScaleDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ answerScale: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(AnswerScaleDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AnswerScaleDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load answerScale on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.answerScale).toEqual(expect.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
