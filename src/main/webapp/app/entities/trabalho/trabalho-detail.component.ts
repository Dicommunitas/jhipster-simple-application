import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITrabalho } from 'app/shared/model/trabalho.model';

@Component({
  selector: 'jhi-trabalho-detail',
  templateUrl: './trabalho-detail.component.html',
})
export class TrabalhoDetailComponent implements OnInit {
  trabalho: ITrabalho | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ trabalho }) => (this.trabalho = trabalho));
  }

  previousState(): void {
    window.history.back();
  }
}
