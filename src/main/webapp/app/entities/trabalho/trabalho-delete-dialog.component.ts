import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITrabalho } from 'app/shared/model/trabalho.model';
import { TrabalhoService } from './trabalho.service';

@Component({
  templateUrl: './trabalho-delete-dialog.component.html',
})
export class TrabalhoDeleteDialogComponent {
  trabalho?: ITrabalho;

  constructor(protected trabalhoService: TrabalhoService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.trabalhoService.delete(id).subscribe(() => {
      this.eventManager.broadcast('trabalhoListModification');
      this.activeModal.close();
    });
  }
}
