import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILocalizacao } from 'app/shared/model/localizacao.model';

@Component({
  selector: 'jhi-localizacao-detail',
  templateUrl: './localizacao-detail.component.html',
})
export class LocalizacaoDetailComponent implements OnInit {
  localizacao: ILocalizacao | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ localizacao }) => (this.localizacao = localizacao));
  }

  previousState(): void {
    window.history.back();
  }
}
