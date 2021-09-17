import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AnswerScaleComponent } from '../list/answer-scale.component';
import { AnswerScaleDetailComponent } from '../detail/answer-scale-detail.component';
import { AnswerScaleUpdateComponent } from '../update/answer-scale-update.component';
import { AnswerScaleRoutingResolveService } from './answer-scale-routing-resolve.service';

const answerScaleRoute: Routes = [
  {
    path: '',
    component: AnswerScaleComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AnswerScaleDetailComponent,
    resolve: {
      answerScale: AnswerScaleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AnswerScaleUpdateComponent,
    resolve: {
      answerScale: AnswerScaleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AnswerScaleUpdateComponent,
    resolve: {
      answerScale: AnswerScaleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(answerScaleRoute)],
  exports: [RouterModule],
})
export class AnswerScaleRoutingModule {}
