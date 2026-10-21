package br.com.sindipro.sindipro.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "vaga_garagem")
public class VagaGaragem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O número da vaga é obrigatório")
    private String numero;

    // Boolean: se vier null no JSON, o Service trata como "não coberta".
    private Boolean coberta;

    // RELAÇÃO OPCIONAL: sem @NotNull de propósito. Uma vaga pode existir sem dono (livre).
    // No banco, isso é uma coluna unidade_id que aceita NULL.
    @ManyToOne
    @JoinColumn(name = "unidade_id")
    private Unidade unidade;

    public VagaGaragem() {
    }

    //Métodos get
    public Long getId() {
        return id;
    }

    public String getNumero() {
        return numero;
    }

    public Boolean getCoberta() {
        return coberta;
    }

    public Unidade getUnidade() {
        return unidade;
    }

    //Métodos set
    public void setId(Long id) {
        this.id = id;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public void setCoberta(Boolean coberta) {
        this.coberta = coberta;
    }

    public void setUnidade(Unidade unidade) {
        this.unidade = unidade;
    }
}
