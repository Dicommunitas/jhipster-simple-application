import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IHistoricoDeTrabalho, HistoricoDeTrabalho } from 'app/shared/model/historico-de-trabalho.model';
import { HistoricoDeTrabalhoService } from './historico-de-trabalho.service';
import { ITrabalho } from 'app/shared/model/trabalho.model';
import { TrabalhoService } from 'app/entities/trabalho/trabalho.service';
import { IDepartamento } from 'app/shared/model/departamento.model';
import { DepartamentoService } from 'app/entities/departamento/departamento.service';
import { IEmpregado } from 'app/shared/model/empregado.model';
import { EmpregadoService } from 'app/entities/empregado/empregado.service';

type SelectableEntity = ITrabalho | IDepartamento | IEmpregado;

@Component({
  selector: 'jhi-historico-de-trabalho-update',
  templateUrl: './historico-de-trabalho-update.component.html',
})
export class HistoricoDeTrabalhoUpdateComponent implements OnInit {
  isSaving = false;
  trabalhos: ITrabalho[] = [];
  departamentos: IDepartamento[] = [];
  empregados: IEmpregado[] = [];

  editForm = this.fb.group({
    id: [],
    dataInicial: [],
    dataFinal: [],
    lingua: [],
    trabalho: [],
    departamento: [],
    empregado: [],
  });

  constructor(
    protected historicoDeTrabalhoService: HistoricoDeTrabalhoService,
    protected trabalhoService: TrabalhoService,
    protected departamentoService: DepartamentoService,
    protected empregadoService: EmpregadoService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ historicoDeTrabalho }) => {
      if (!historicoDeTrabalho.id) {
        const today = moment().startOf('day');
        historicoDeTrabalho.dataInicial = today;
        historicoDeTrabalho.dataFinal = today;
      }

      this.updateForm(historicoDeTrabalho);

      this.trabalhoService
        .query({ filter: 'historicodetrabalho-is-null' })
        .pipe(
          map((res: HttpResponse<ITrabalho[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: ITrabalho[]) => {
          if (!historicoDeTrabalho.trabalho || !historicoDeTrabalho.trabalho.id) {
            this.trabalhos = resBody;
          } else {
            this.trabalhoService
              .find(historicoDeTrabalho.trabalho.id)
              .pipe(
                map((subRes: HttpResponse<ITrabalho>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: ITrabalho[]) => (this.trabalhos = concatRes));
          }
        });

      this.departamentoService
        .query({ filter: 'historicodetrabalho-is-null' })
        .pipe(
          map((res: HttpResponse<IDepartamento[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IDepartamento[]) => {
          if (!historicoDeTrabalho.departamento || !historicoDeTrabalho.departamento.id) {
            this.departamentos = resBody;
          } else {
            this.departamentoService
              .find(historicoDeTrabalho.departamento.id)
              .pipe(
                map((subRes: HttpResponse<IDepartamento>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IDepartamento[]) => (this.departamentos = concatRes));
          }
        });

      this.empregadoService
        .query({ filter: 'historicodetrabalho-is-null' })
        .pipe(
          map((res: HttpResponse<IEmpregado[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IEmpregado[]) => {
          if (!historicoDeTrabalho.empregado || !historicoDeTrabalho.empregado.id) {
            this.empregados = resBody;
          } else {
            this.empregadoService
              .find(historicoDeTrabalho.empregado.id)
              .pipe(
                map((subRes: HttpResponse<IEmpregado>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IEmpregado[]) => (this.empregados = concatRes));
          }
        });
    });
  }

  updateForm(historicoDeTrabalho: IHistoricoDeTrabalho): void {
    this.editForm.patchValue({
      id: historicoDeTrabalho.id,
      dataInicial: historicoDeTrabalho.dataInicial ? historicoDeTrabalho.dataInicial.format(DATE_TIME_FORMAT) : null,
      dataFinal: historicoDeTrabalho.dataFinal ? historicoDeTrabalho.dataFinal.format(DATE_TIME_FORMAT) : null,
      lingua: historicoDeTrabalho.lingua,
      trabalho: historicoDeTrabalho.trabalho,
      departamento: historicoDeTrabalho.departamento,
      empregado: historicoDeTrabalho.empregado,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const historicoDeTrabalho = this.createFromForm();
    if (historicoDeTrabalho.id !== undefined) {
      this.subscribeToSaveResponse(this.historicoDeTrabalhoService.update(historicoDeTrabalho));
    } else {
      this.subscribeToSaveResponse(this.historicoDeTrabalhoService.create(historicoDeTrabalho));
    }
  }

  private createFromForm(): IHistoricoDeTrabalho {
    return {
      ...new HistoricoDeTrabalho(),
      id: this.editForm.get(['id'])!.value,
      dataInicial: this.editForm.get(['dataInicial'])!.value
        ? moment(this.editForm.get(['dataInicial'])!.value, DATE_TIME_FORMAT)
        : undefined,
      dataFinal: this.editForm.get(['dataFinal'])!.value ? moment(this.editForm.get(['dataFinal'])!.value, DATE_TIME_FORMAT) : undefined,
      lingua: this.editForm.get(['lingua'])!.value,
      trabalho: this.editForm.get(['trabalho'])!.value,
      departamento: this.editForm.get(['departamento'])!.value,
      empregado: this.editForm.get(['empregado'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHistoricoDeTrabalho>>): void {
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
