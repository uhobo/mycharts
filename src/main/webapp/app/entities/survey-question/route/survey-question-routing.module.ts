import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SurveyQuestionComponent } from '../list/survey-question.component';
import { SurveyQuestionDetailComponent } from '../detail/survey-question-detail.component';
import { SurveyQuestionUpdateComponent } from '../update/survey-question-update.component';
import { SurveyQuestionRoutingResolveService } from './survey-question-routing-resolve.service';

const surveyQuestionRoute: Routes = [
  {
    path: '',
    component: SurveyQuestionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SurveyQuestionDetailComponent,
    resolve: {
      surveyQuestion: SurveyQuestionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SurveyQuestionUpdateComponent,
    resolve: {
      surveyQuestion: SurveyQuestionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SurveyQuestionUpdateComponent,
    resolve: {
      surveyQuestion: SurveyQuestionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(surveyQuestionRoute)],
  exports: [RouterModule],
})
export class SurveyQuestionRoutingModule {}
