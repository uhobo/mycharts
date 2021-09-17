jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AnswerScaleService } from '../service/answer-scale.service';

import { AnswerScaleDeleteDialogComponent } from './answer-scale-delete-dialog.component';

describe('Component Tests', () => {
  describe('AnswerScale Management Delete Component', () => {
    let comp: AnswerScaleDeleteDialogComponent;
    let fixture: ComponentFixture<AnswerScaleDeleteDialogComponent>;
    let service: AnswerScaleService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AnswerScaleDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(AnswerScaleDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AnswerScaleDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AnswerScaleService);
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
