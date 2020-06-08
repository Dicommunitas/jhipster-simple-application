import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IHistoricoDeTrabalho } from 'app/shared/model/historico-de-trabalho.model';
import { HistoricoDeTrabalhoService } from './historico-de-trabalho.service';

@Component({
  templateUrl: './historico-de-trabalho-delete-dialog.component.html',
})
export class HistoricoDeTrabalhoDeleteDialogComponent {
  historicoDeTrabalho?: IHistoricoDeTrabalho;

  constructor(
    protected historicoDeTrabalhoService: HistoricoDeTrabalhoService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.historicoDeTrabalhoService.delete(id).subscribe(() => {
      this.eventManager.broadcast('historicoDeTrabalhoListModification');
      this.activeModal.close();
    });
  }
}
