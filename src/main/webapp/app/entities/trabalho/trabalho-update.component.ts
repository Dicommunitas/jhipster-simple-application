import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ITrabalho, Trabalho } from 'app/shared/model/trabalho.model';
import { TrabalhoService } from './trabalho.service';
import { ITarefa } from 'app/shared/model/tarefa.model';
import { TarefaService } from 'app/entities/tarefa/tarefa.service';
import { IEmpregado } from 'app/shared/model/empregado.model';
import { EmpregadoService } from 'app/entities/empregado/empregado.service';

type SelectableEntity = ITarefa | IEmpregado;

@Component({
  selector: 'jhi-trabalho-update',
  templateUrl: './trabalho-update.component.html',
})
export class TrabalhoUpdateComponent implements OnInit {
  isSaving = false;
  tarefas: ITarefa[] = [];
  empregados: IEmpregado[] = [];

  editForm = this.fb.group({
    id: [],
    titulo: [],
    salarioMinimo: [],
    salarioMaximo: [],
    tarefas: [],
    empregado: [],
  });

  constructor(
    protected trabalhoService: TrabalhoService,
    protected tarefaService: TarefaService,
    protected empregadoService: EmpregadoService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ trabalho }) => {
      this.updateForm(trabalho);

      this.tarefaService.query().subscribe((res: HttpResponse<ITarefa[]>) => (this.tarefas = res.body || []));

      this.empregadoService.query().subscribe((res: HttpResponse<IEmpregado[]>) => (this.empregados = res.body || []));
    });
  }

  updateForm(trabalho: ITrabalho): void {
    this.editForm.patchValue({
      id: trabalho.id,
      titulo: trabalho.titulo,
      salarioMinimo: trabalho.salarioMinimo,
      salarioMaximo: trabalho.salarioMaximo,
      tarefas: trabalho.tarefas,
      empregado: trabalho.empregado,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const trabalho = this.createFromForm();
    if (trabalho.id !== undefined) {
      this.subscribeToSaveResponse(this.trabalhoService.update(trabalho));
    } else {
      this.subscribeToSaveResponse(this.trabalhoService.create(trabalho));
    }
  }

  private createFromForm(): ITrabalho {
    return {
      ...new Trabalho(),
      id: this.editForm.get(['id'])!.value,
      titulo: this.editForm.get(['titulo'])!.value,
      salarioMinimo: this.editForm.get(['salarioMinimo'])!.value,
      salarioMaximo: this.editForm.get(['salarioMaximo'])!.value,
      tarefas: this.editForm.get(['tarefas'])!.value,
      empregado: this.editForm.get(['empregado'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITrabalho>>): void {
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

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  getSelected(selectedVals: ITarefa[], option: ITarefa): ITarefa {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
