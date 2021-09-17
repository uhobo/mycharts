import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAnswerScale, AnswerScale } from '../answer-scale.model';

import { AnswerScaleService } from './answer-scale.service';

describe('Service Tests', () => {
  describe('AnswerScale Service', () => {
    let service: AnswerScaleService;
    let httpMock: HttpTestingController;
    let elemDefault: IAnswerScale;
    let expectedResult: IAnswerScale | IAnswerScale[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(AnswerScaleService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        score: 0,
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

      it('should create a AnswerScale', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new AnswerScale()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a AnswerScale', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            score: 1,
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

      it('should partial update a AnswerScale', () => {
        const patchObject = Object.assign(
          {
            score: 1,
            description: 'BBBBBB',
          },
          new AnswerScale()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of AnswerScale', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            score: 1,
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

      it('should delete a AnswerScale', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addAnswerScaleToCollectionIfMissing', () => {
        it('should add a AnswerScale to an empty array', () => {
          const answerScale: IAnswerScale = { id: 'ABC' };
          expectedResult = service.addAnswerScaleToCollectionIfMissing([], answerScale);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(answerScale);
        });

        it('should not add a AnswerScale to an array that contains it', () => {
          const answerScale: IAnswerScale = { id: 'ABC' };
          const answerScaleCollection: IAnswerScale[] = [
            {
              ...answerScale,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addAnswerScaleToCollectionIfMissing(answerScaleCollection, answerScale);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a AnswerScale to an array that doesn't contain it", () => {
          const answerScale: IAnswerScale = { id: 'ABC' };
          const answerScaleCollection: IAnswerScale[] = [{ id: 'CBA' }];
          expectedResult = service.addAnswerScaleToCollectionIfMissing(answerScaleCollection, answerScale);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(answerScale);
        });

        it('should add only unique AnswerScale to an array', () => {
          const answerScaleArray: IAnswerScale[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'e30d93e9-efba-405c-8326-6421a5d6eaa8' }];
          const answerScaleCollection: IAnswerScale[] = [{ id: 'ABC' }];
          expectedResult = service.addAnswerScaleToCollectionIfMissing(answerScaleCollection, ...answerScaleArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const answerScale: IAnswerScale = { id: 'ABC' };
          const answerScale2: IAnswerScale = { id: 'CBA' };
          expectedResult = service.addAnswerScaleToCollectionIfMissing([], answerScale, answerScale2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(answerScale);
          expect(expectedResult).toContain(answerScale2);
        });

        it('should accept null and undefined values', () => {
          const answerScale: IAnswerScale = { id: 'ABC' };
          expectedResult = service.addAnswerScaleToCollectionIfMissing([], null, answerScale, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(answerScale);
        });

        it('should return initial array if no AnswerScale is added', () => {
          const answerScaleCollection: IAnswerScale[] = [{ id: 'ABC' }];
          expectedResult = service.addAnswerScaleToCollectionIfMissing(answerScaleCollection, undefined, null);
          expect(expectedResult).toEqual(answerScaleCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
