import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AnswerScaleComponent } from './list/answer-scale.component';
import { AnswerScaleDetailComponent } from './detail/answer-scale-detail.component';
import { AnswerScaleUpdateComponent } from './update/answer-scale-update.component';
import { AnswerScaleDeleteDialogComponent } from './delete/answer-scale-delete-dialog.component';
import { AnswerScaleRoutingModule } from './route/answer-scale-routing.module';

@NgModule({
  imports: [SharedModule, AnswerScaleRoutingModule],
  declarations: [AnswerScaleComponent, AnswerScaleDetailComponent, AnswerScaleUpdateComponent, AnswerScaleDeleteDialogComponent],
  entryComponents: [AnswerScaleDeleteDialogComponent],
})
export class AnswerScaleModule {}
