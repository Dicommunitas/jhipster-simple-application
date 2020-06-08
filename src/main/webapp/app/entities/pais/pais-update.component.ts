import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IPais, Pais } from 'app/shared/model/pais.model';
import { PaisService } from './pais.service';
import { IRegiao } from 'app/shared/model/regiao.model';
import { RegiaoService } from 'app/entities/regiao/regiao.service';

@Component({
  selector: 'jhi-pais-update',
  templateUrl: './pais-update.component.html',
})
export class PaisUpdateComponent implements OnInit {
  isSaving = false;
  regiaos: IRegiao[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [],
    regiao: [],
  });

  constructor(
    protected paisService: PaisService,
    protected regiaoService: RegiaoService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pais }) => {
      this.updateForm(pais);

      this.regiaoService
        .query({ filter: 'pais-is-null' })
        .pipe(
          map((res: HttpResponse<IRegiao[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IRegiao[]) => {
          if (!pais.regiao || !pais.regiao.id) {
            this.regiaos = resBody;
          } else {
            this.regiaoService
              .find(pais.regiao.id)
              .pipe(
                map((subRes: HttpResponse<IRegiao>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IRegiao[]) => (this.regiaos = concatRes));
          }
        });
    });
  }

  updateForm(pais: IPais): void {
    this.editForm.patchValue({
      id: pais.id,
      nome: pais.nome,
      regiao: pais.regiao,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pais = this.createFromForm();
    if (pais.id !== undefined) {
      this.subscribeToSaveResponse(this.paisService.update(pais));
    } else {
      this.subscribeToSaveResponse(this.paisService.create(pais));
    }
  }

  private createFromForm(): IPais {
    return {
      ...new Pais(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      regiao: this.editForm.get(['regiao'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPais>>): void {
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

  trackById(index: number, item: IRegiao): any {
    return item.id;
  }
}
