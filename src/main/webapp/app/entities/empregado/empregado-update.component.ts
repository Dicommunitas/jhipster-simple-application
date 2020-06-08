import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IEmpregado, Empregado } from 'app/shared/model/empregado.model';
import { EmpregadoService } from './empregado.service';
import { IDepartamento } from 'app/shared/model/departamento.model';
import { DepartamentoService } from 'app/entities/departamento/departamento.service';

type SelectableEntity = IEmpregado | IDepartamento;

@Component({
  selector: 'jhi-empregado-update',
  templateUrl: './empregado-update.component.html',
})
export class EmpregadoUpdateComponent implements OnInit {
  isSaving = false;
  empregados: IEmpregado[] = [];
  departamentos: IDepartamento[] = [];

  editForm = this.fb.group({
    id: [],
    primeiroNome: [],
    sobrenome: [],
    email: [],
    telefone: [],
    dataContratacao: [],
    salario: [],
    comissao: [],
    gerente: [],
    departamento: [],
  });

  constructor(
    protected empregadoService: EmpregadoService,
    protected departamentoService: DepartamentoService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ empregado }) => {
      if (!empregado.id) {
        const today = moment().startOf('day');
        empregado.dataContratacao = today;
      }

      this.updateForm(empregado);

      this.empregadoService.query().subscribe((res: HttpResponse<IEmpregado[]>) => (this.empregados = res.body || []));

      this.departamentoService.query().subscribe((res: HttpResponse<IDepartamento[]>) => (this.departamentos = res.body || []));
    });
  }

  updateForm(empregado: IEmpregado): void {
    this.editForm.patchValue({
      id: empregado.id,
      primeiroNome: empregado.primeiroNome,
      sobrenome: empregado.sobrenome,
      email: empregado.email,
      telefone: empregado.telefone,
      dataContratacao: empregado.dataContratacao ? empregado.dataContratacao.format(DATE_TIME_FORMAT) : null,
      salario: empregado.salario,
      comissao: empregado.comissao,
      gerente: empregado.gerente,
      departamento: empregado.departamento,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const empregado = this.createFromForm();
    if (empregado.id !== undefined) {
      this.subscribeToSaveResponse(this.empregadoService.update(empregado));
    } else {
      this.subscribeToSaveResponse(this.empregadoService.create(empregado));
    }
  }

  private createFromForm(): IEmpregado {
    return {
      ...new Empregado(),
      id: this.editForm.get(['id'])!.value,
      primeiroNome: this.editForm.get(['primeiroNome'])!.value,
      sobrenome: this.editForm.get(['sobrenome'])!.value,
      email: this.editForm.get(['email'])!.value,
      telefone: this.editForm.get(['telefone'])!.value,
      dataContratacao: this.editForm.get(['dataContratacao'])!.value
        ? moment(this.editForm.get(['dataContratacao'])!.value, DATE_TIME_FORMAT)
        : undefined,
      salario: this.editForm.get(['salario'])!.value,
      comissao: this.editForm.get(['comissao'])!.value,
      gerente: this.editForm.get(['gerente'])!.value,
      departamento: this.editForm.get(['departamento'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmpregado>>): void {
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
}
