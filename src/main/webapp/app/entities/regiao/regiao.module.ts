import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterSampleApplicationSharedModule } from 'app/shared/shared.module';
import { RegiaoComponent } from './regiao.component';
import { RegiaoDetailComponent } from './regiao-detail.component';
import { RegiaoUpdateComponent } from './regiao-update.component';
import { RegiaoDeleteDialogComponent } from './regiao-delete-dialog.component';
import { regiaoRoute } from './regiao.route';

@NgModule({
  imports: [JhipsterSampleApplicationSharedModule, RouterModule.forChild(regiaoRoute)],
  declarations: [RegiaoComponent, RegiaoDetailComponent, RegiaoUpdateComponent, RegiaoDeleteDialogComponent],
  entryComponents: [RegiaoDeleteDialogComponent],
})
export class JhipsterSampleApplicationRegiaoModule {}
