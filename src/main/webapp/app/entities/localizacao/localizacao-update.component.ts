import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ILocalizacao, Localizacao } from 'app/shared/model/localizacao.model';
import { LocalizacaoService } from './localizacao.service';
import { IPais } from 'app/shared/model/pais.model';
import { PaisService } from 'app/entities/pais/pais.service';

@Component({
  selector: 'jhi-localizacao-update',
  templateUrl: './localizacao-update.component.html',
})
export class LocalizacaoUpdateComponent implements OnInit {
  isSaving = false;
  pais: IPais[] = [];

  editForm = this.fb.group({
    id: [],
    endereco: [],
    cep: [],
    cidade: [],
    bairro: [],
    pais: [],
  });

  constructor(
    protected localizacaoService: LocalizacaoService,
    protected paisService: PaisService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ localizacao }) => {
      this.updateForm(localizacao);

      this.paisService
        .query({ filter: 'localizacao-is-null' })
        .pipe(
          map((res: HttpResponse<IPais[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IPais[]) => {
          if (!localizacao.pais || !localizacao.pais.id) {
            this.pais = resBody;
          } else {
            this.paisService
              .find(localizacao.pais.id)
              .pipe(
                map((subRes: HttpResponse<IPais>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IPais[]) => (this.pais = concatRes));
          }
        });
    });
  }

  updateForm(localizacao: ILocalizacao): void {
    this.editForm.patchValue({
      id: localizacao.id,
      endereco: localizacao.endereco,
      cep: localizacao.cep,
      cidade: localizacao.cidade,
      bairro: localizacao.bairro,
      pais: localizacao.pais,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const localizacao = this.createFromForm();
    if (localizacao.id !== undefined) {
      this.subscribeToSaveResponse(this.localizacaoService.update(localizacao));
    } else {
      this.subscribeToSaveResponse(this.localizacaoService.create(localizacao));
    }
  }

  private createFromForm(): ILocalizacao {
    return {
      ...new Localizacao(),
      id: this.editForm.get(['id'])!.value,
      endereco: this.editForm.get(['endereco'])!.value,
      cep: this.editForm.get(['cep'])!.value,
      cidade: this.editForm.get(['cidade'])!.value,
      bairro: this.editForm.get(['bairro'])!.value,
      pais: this.editForm.get(['pais'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILocalizacao>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IPais): any {
    return item.id;
  }
}
