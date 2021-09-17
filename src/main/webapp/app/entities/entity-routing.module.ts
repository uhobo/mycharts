import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'survey',
        data: { pageTitle: 'mychartsApp.survey.home.title' },
        loadChildren: () => import('./survey/survey.module').then(m => m.SurveyModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
