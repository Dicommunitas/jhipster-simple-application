import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterSampleApplicationSharedModule } from 'app/shared/shared.module';
import { DepartamentoComponent } from './departamento.component';
import { DepartamentoDetailComponent } from './departamento-detail.component';
import { DepartamentoUpdateComponent } from './departamento-update.component';
import { DepartamentoDeleteDialogComponent } from './departamento-delete-dialog.component';
import { departamentoRoute } from './departamento.route';

@NgModule({
  imports: [JhipsterSampleApplicationSharedModule, RouterModule.forChild(departamentoRoute)],
  declarations: [DepartamentoComponent, DepartamentoDetailComponent, DepartamentoUpdateComponent, DepartamentoDeleteDialogComponent],
  entryComponents: [DepartamentoDeleteDialogComponent],
})
export class JhipsterSampleApplicationDepartamentoModule {}
