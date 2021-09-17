import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SurveyQuestionComponent } from './list/survey-question.component';
import { SurveyQuestionDetailComponent } from './detail/survey-question-detail.component';
import { SurveyQuestionUpdateComponent } from './update/survey-question-update.component';
import { SurveyQuestionDeleteDialogComponent } from './delete/survey-question-delete-dialog.component';
import { SurveyQuestionRoutingModule } from './route/survey-question-routing.module';

@NgModule({
  imports: [SharedModule, SurveyQuestionRoutingModule],
  declarations: [
    SurveyQuestionComponent,
    SurveyQuestionDetailComponent,
    SurveyQuestionUpdateComponent,
    SurveyQuestionDeleteDialogComponent,
  ],
  entryComponents: [SurveyQuestionDeleteDialogComponent],
})
export class SurveyQuestionModule {}
