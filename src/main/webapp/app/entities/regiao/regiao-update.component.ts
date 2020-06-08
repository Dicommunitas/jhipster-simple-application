import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IRegiao, Regiao } from 'app/shared/model/regiao.model';
import { RegiaoService } from './regiao.service';

@Component({
  selector: 'jhi-regiao-update',
  templateUrl: './regiao-update.component.html',
})
export class RegiaoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nome: [],
  });

  constructor(protected regiaoService: RegiaoService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ regiao }) => {
      this.updateForm(regiao);
    });
  }

  updateForm(regiao: IRegiao): void {
    this.editForm.patchValue({
      id: regiao.id,
      nome: regiao.nome,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const regiao = this.createFromForm();
    if (regiao.id !== undefined) {
      this.subscribeToSaveResponse(this.regiaoService.update(regiao));
    } else {
      this.subscribeToSaveResponse(this.regiaoService.create(regiao));
    }
  }

  private createFromForm(): IRegiao {
    return {
      ...new Regiao(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRegiao>>): void {
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
}
