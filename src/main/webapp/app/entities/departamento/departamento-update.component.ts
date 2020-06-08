import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IDepartamento, Departamento } from 'app/shared/model/departamento.model';
import { DepartamentoService } from './departamento.service';
import { ILocalizacao } from 'app/shared/model/localizacao.model';
import { LocalizacaoService } from 'app/entities/localizacao/localizacao.service';

@Component({
  selector: 'jhi-departamento-update',
  templateUrl: './departamento-update.component.html',
})
export class DepartamentoUpdateComponent implements OnInit {
  isSaving = false;
  localizacaos: ILocalizacao[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [null, [Validators.required]],
    localizacao: [],
  });

  constructor(
    protected departamentoService: DepartamentoService,
    protected localizacaoService: LocalizacaoService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ departamento }) => {
      this.updateForm(departamento);

      this.localizacaoService
        .query({ filter: 'departamento-is-null' })
        .pipe(
          map((res: HttpResponse<ILocalizacao[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: ILocalizacao[]) => {
          if (!departamento.localizacao || !departamento.localizacao.id) {
            this.localizacaos = resBody;
          } else {
            this.localizacaoService
              .find(departamento.localizacao.id)
              .pipe(
                map((subRes: HttpResponse<ILocalizacao>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: ILocalizacao[]) => (this.localizacaos = concatRes));
          }
        });
    });
  }

  updateForm(departamento: IDepartamento): void {
    this.editForm.patchValue({
      id: departamento.id,
      nome: departamento.nome,
      localizacao: departamento.localizacao,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const departamento = this.createFromForm();
    if (departamento.id !== undefined) {
      this.subscribeToSaveResponse(this.departamentoService.update(departamento));
    } else {
      this.subscribeToSaveResponse(this.departamentoService.create(departamento));
    }
  }

  private createFromForm(): IDepartamento {
    return {
      ...new Departamento(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      localizacao: this.editForm.get(['localizacao'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDepartamento>>): void {
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

  trackById(index: number, item: ILocalizacao): any {
    return item.id;
  }
}
