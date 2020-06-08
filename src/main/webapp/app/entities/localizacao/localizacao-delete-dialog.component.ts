import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ILocalizacao } from 'app/shared/model/localizacao.model';
import { LocalizacaoService } from './localizacao.service';

@Component({
  templateUrl: './localizacao-delete-dialog.component.html',
})
export class LocalizacaoDeleteDialogComponent {
  localizacao?: ILocalizacao;

  constructor(
    protected localizacaoService: LocalizacaoService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.localizacaoService.delete(id).subscribe(() => {
      this.eventManager.broadcast('localizacaoListModification');
      this.activeModal.close();
    });
  }
}
