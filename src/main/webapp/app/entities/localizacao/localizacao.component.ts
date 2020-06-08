import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILocalizacao } from 'app/shared/model/localizacao.model';
import { LocalizacaoService } from './localizacao.service';
import { LocalizacaoDeleteDialogComponent } from './localizacao-delete-dialog.component';

@Component({
  selector: 'jhi-localizacao',
  templateUrl: './localizacao.component.html',
})
export class LocalizacaoComponent implements OnInit, OnDestroy {
  localizacaos?: ILocalizacao[];
  eventSubscriber?: Subscription;

  constructor(
    protected localizacaoService: LocalizacaoService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.localizacaoService.query().subscribe((res: HttpResponse<ILocalizacao[]>) => (this.localizacaos = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInLocalizacaos();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ILocalizacao): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInLocalizacaos(): void {
    this.eventSubscriber = this.eventManager.subscribe('localizacaoListModification', () => this.loadAll());
  }

  delete(localizacao: ILocalizacao): void {
    const modalRef = this.modalService.open(LocalizacaoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.localizacao = localizacao;
  }
}
