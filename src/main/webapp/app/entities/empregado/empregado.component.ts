import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmpregado } from 'app/shared/model/empregado.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { EmpregadoService } from './empregado.service';
import { EmpregadoDeleteDialogComponent } from './empregado-delete-dialog.component';

@Component({
  selector: 'jhi-empregado',
  templateUrl: './empregado.component.html',
})
export class EmpregadoComponent implements OnInit, OnDestroy {
  empregados: IEmpregado[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(
    protected empregadoService: EmpregadoService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks
  ) {
    this.empregados = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.empregadoService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<IEmpregado[]>) => this.paginateEmpregados(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.empregados = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInEmpregados();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IEmpregado): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInEmpregados(): void {
    this.eventSubscriber = this.eventManager.subscribe('empregadoListModification', () => this.reset());
  }

  delete(empregado: IEmpregado): void {
    const modalRef = this.modalService.open(EmpregadoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.empregado = empregado;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateEmpregados(data: IEmpregado[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.empregados.push(data[i]);
      }
    }
  }
}
