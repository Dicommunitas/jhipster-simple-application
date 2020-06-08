package com.mycompany.myapp.domain;

import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Departamento.
 */
@Entity
@Table(name = "departamento")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Departamento implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "nome", nullable = false)
    private String nome;

    @OneToOne
    @JoinColumn(unique = true)
    private Localizacao localizacao;

    /**
     * Um relacionamento
     */
    @ApiModelProperty(value = "Um relacionamento")
    @OneToMany(mappedBy = "departamento")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Empregado> empregados = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public Departamento nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Localizacao getLocalizacao() {
        return localizacao;
    }

    public Departamento localizacao(Localizacao localizacao) {
        this.localizacao = localizacao;
        return this;
    }

    public void setLocalizacao(Localizacao localizacao) {
        this.localizacao = localizacao;
    }

    public Set<Empregado> getEmpregados() {
        return empregados;
    }

    public Departamento empregados(Set<Empregado> empregados) {
        this.empregados = empregados;
        return this;
    }

    public Departamento addEmpregado(Empregado empregado) {
        this.empregados.add(empregado);
        empregado.setDepartamento(this);
        return this;
    }

    public Departamento removeEmpregado(Empregado empregado) {
        this.empregados.remove(empregado);
        empregado.setDepartamento(null);
        return this;
    }

    public void setEmpregados(Set<Empregado> empregados) {
        this.empregados = empregados;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Departamento)) {
            return false;
        }
        return id != null && id.equals(((Departamento) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Departamento{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            "}";
    }
}
