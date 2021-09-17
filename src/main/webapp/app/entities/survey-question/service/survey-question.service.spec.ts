import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISurveyQuestion, SurveyQuestion } from '../survey-question.model';

import { SurveyQuestionService } from './survey-question.service';

describe('Service Tests', () => {
  describe('SurveyQuestion Service', () => {
    let service: SurveyQuestionService;
    let httpMock: HttpTestingController;
    let elemDefault: ISurveyQuestion;
    let expectedResult: ISurveyQuestion | ISurveyQuestion[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SurveyQuestionService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        questionId: 0,
        description: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find('ABC').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a SurveyQuestion', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new SurveyQuestion()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a SurveyQuestion', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            questionId: 1,
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a SurveyQuestion', () => {
        const patchObject = Object.assign(
          {
            questionId: 1,
            description: 'BBBBBB',
          },
          new SurveyQuestion()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of SurveyQuestion', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            questionId: 1,
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a SurveyQuestion', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSurveyQuestionToCollectionIfMissing', () => {
        it('should add a SurveyQuestion to an empty array', () => {
          const surveyQuestion: ISurveyQuestion = { id: 'ABC' };
          expectedResult = service.addSurveyQuestionToCollectionIfMissing([], surveyQuestion);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(surveyQuestion);
        });

        it('should not add a SurveyQuestion to an array that contains it', () => {
          const surveyQuestion: ISurveyQuestion = { id: 'ABC' };
          const surveyQuestionCollection: ISurveyQuestion[] = [
            {
              ...surveyQuestion,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addSurveyQuestionToCollectionIfMissing(surveyQuestionCollection, surveyQuestion);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a SurveyQuestion to an array that doesn't contain it", () => {
          const surveyQuestion: ISurveyQuestion = { id: 'ABC' };
          const surveyQuestionCollection: ISurveyQuestion[] = [{ id: 'CBA' }];
          expectedResult = service.addSurveyQuestionToCollectionIfMissing(surveyQuestionCollection, surveyQuestion);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(surveyQuestion);
        });

        it('should add only unique SurveyQuestion to an array', () => {
          const surveyQuestionArray: ISurveyQuestion[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '73eaeb66-dbe5-4db0-a6f6-709a56d756c8' }];
          const surveyQuestionCollection: ISurveyQuestion[] = [{ id: 'ABC' }];
          expectedResult = service.addSurveyQuestionToCollectionIfMissing(surveyQuestionCollection, ...surveyQuestionArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const surveyQuestion: ISurveyQuestion = { id: 'ABC' };
          const surveyQuestion2: ISurveyQuestion = { id: 'CBA' };
          expectedResult = service.addSurveyQuestionToCollectionIfMissing([], surveyQuestion, surveyQuestion2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(surveyQuestion);
          expect(expectedResult).toContain(surveyQuestion2);
        });

        it('should accept null and undefined values', () => {
          const surveyQuestion: ISurveyQuestion = { id: 'ABC' };
          expectedResult = service.addSurveyQuestionToCollectionIfMissing([], null, surveyQuestion, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(surveyQuestion);
        });

        it('should return initial array if no SurveyQuestion is added', () => {
          const surveyQuestionCollection: ISurveyQuestion[] = [{ id: 'ABC' }];
          expectedResult = service.addSurveyQuestionToCollectionIfMissing(surveyQuestionCollection, undefined, null);
          expect(expectedResult).toEqual(surveyQuestionCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
