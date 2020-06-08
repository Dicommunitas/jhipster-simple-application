import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IHistoricoDeTrabalho } from 'app/shared/model/historico-de-trabalho.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { HistoricoDeTrabalhoService } from './historico-de-trabalho.service';
import { HistoricoDeTrabalhoDeleteDialogComponent } from './historico-de-trabalho-delete-dialog.component';

@Component({
  selector: 'jhi-historico-de-trabalho',
  templateUrl: './historico-de-trabalho.component.html',
})
export class HistoricoDeTrabalhoComponent implements OnInit, OnDestroy {
  historicoDeTrabalhos: IHistoricoDeTrabalho[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(
    protected historicoDeTrabalhoService: HistoricoDeTrabalhoService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks
  ) {
    this.historicoDeTrabalhos = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.historicoDeTrabalhoService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<IHistoricoDeTrabalho[]>) => this.paginateHistoricoDeTrabalhos(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.historicoDeTrabalhos = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInHistoricoDeTrabalhos();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IHistoricoDeTrabalho): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInHistoricoDeTrabalhos(): void {
    this.eventSubscriber = this.eventManager.subscribe('historicoDeTrabalhoListModification', () => this.reset());
  }

  delete(historicoDeTrabalho: IHistoricoDeTrabalho): void {
    const modalRef = this.modalService.open(HistoricoDeTrabalhoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.historicoDeTrabalho = historicoDeTrabalho;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateHistoricoDeTrabalhos(data: IHistoricoDeTrabalho[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.historicoDeTrabalhos.push(data[i]);
      }
    }
  }
}
