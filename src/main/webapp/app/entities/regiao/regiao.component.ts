import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRegiao } from 'app/shared/model/regiao.model';
import { RegiaoService } from './regiao.service';
import { RegiaoDeleteDialogComponent } from './regiao-delete-dialog.component';

@Component({
  selector: 'jhi-regiao',
  templateUrl: './regiao.component.html',
})
export class RegiaoComponent implements OnInit, OnDestroy {
  regiaos?: IRegiao[];
  eventSubscriber?: Subscription;

  constructor(protected regiaoService: RegiaoService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.regiaoService.query().subscribe((res: HttpResponse<IRegiao[]>) => (this.regiaos = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInRegiaos();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IRegiao): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInRegiaos(): void {
    this.eventSubscriber = this.eventManager.subscribe('regiaoListModification', () => this.loadAll());
  }

  delete(regiao: IRegiao): void {
    const modalRef = this.modalService.open(RegiaoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.regiao = regiao;
  }
}
