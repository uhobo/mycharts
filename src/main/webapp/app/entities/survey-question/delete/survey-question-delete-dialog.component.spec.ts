jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SurveyQuestionService } from '../service/survey-question.service';

import { SurveyQuestionDeleteDialogComponent } from './survey-question-delete-dialog.component';

describe('Component Tests', () => {
  describe('SurveyQuestion Management Delete Component', () => {
    let comp: SurveyQuestionDeleteDialogComponent;
    let fixture: ComponentFixture<SurveyQuestionDeleteDialogComponent>;
    let service: SurveyQuestionService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SurveyQuestionDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(SurveyQuestionDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SurveyQuestionDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(SurveyQuestionService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({})));

          // WHEN
          comp.confirmDelete('ABC');
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith('ABC');
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        jest.spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
