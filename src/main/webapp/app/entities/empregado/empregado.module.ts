import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterSampleApplicationSharedModule } from 'app/shared/shared.module';
import { EmpregadoComponent } from './empregado.component';
import { EmpregadoDetailComponent } from './empregado-detail.component';
import { EmpregadoUpdateComponent } from './empregado-update.component';
import { EmpregadoDeleteDialogComponent } from './empregado-delete-dialog.component';
import { empregadoRoute } from './empregado.route';

@NgModule({
  imports: [JhipsterSampleApplicationSharedModule, RouterModule.forChild(empregadoRoute)],
  declarations: [EmpregadoComponent, EmpregadoDetailComponent, EmpregadoUpdateComponent, EmpregadoDeleteDialogComponent],
  entryComponents: [EmpregadoDeleteDialogComponent],
})
export class JhipsterSampleApplicationEmpregadoModule {}
