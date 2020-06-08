import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'regiao',
        loadChildren: () => import('./regiao/regiao.module').then(m => m.JhipsterSampleApplicationRegiaoModule),
      },
      {
        path: 'pais',
        loadChildren: () => import('./pais/pais.module').then(m => m.JhipsterSampleApplicationPaisModule),
      },
      {
        path: 'localizacao',
        loadChildren: () => import('./localizacao/localizacao.module').then(m => m.JhipsterSampleApplicationLocalizacaoModule),
      },
      {
        path: 'departamento',
        loadChildren: () => import('./departamento/departamento.module').then(m => m.JhipsterSampleApplicationDepartamentoModule),
      },
      {
        path: 'tarefa',
        loadChildren: () => import('./tarefa/tarefa.module').then(m => m.JhipsterSampleApplicationTarefaModule),
      },
      {
        path: 'empregado',
        loadChildren: () => import('./empregado/empregado.module').then(m => m.JhipsterSampleApplicationEmpregadoModule),
      },
      {
        path: 'trabalho',
        loadChildren: () => import('./trabalho/trabalho.module').then(m => m.JhipsterSampleApplicationTrabalhoModule),
      },
      {
        path: 'historico-de-trabalho',
        loadChildren: () =>
          import('./historico-de-trabalho/historico-de-trabalho.module').then(m => m.JhipsterSampleApplicationHistoricoDeTrabalhoModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class JhipsterSampleApplicationEntityModule {}
