package br.com.sindipro.sindipro.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
@Table(name = "unidade")
public class Unidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Muitas unidades pertencem a UM prédio. A coluna predio_id guarda essa ligação.
    // @NotNull: não existe unidade "solta", ela sempre precisa de um prédio.
    @NotNull(message = "A unidade precisa pertencer a um prédio")
    @ManyToOne
    @JoinColumn(name = "predio_id")
    private Predio predio;

    @Positive(message = "O número do apartamento deve ser maior que zero")
    private int numeroApartamento;

    @NotBlank(message = "O bloco é obrigatório")
    private String bloco;

    @PositiveOrZero(message = "O andar não pode ser negativo")
    private int andar;

    public Unidade() {
    }

    //Métodos get
    public Long getId() {
        return id;
    }

    public int getNumeroApartamento() {
        return numeroApartamento;
    }

    public String getBloco() {
        return bloco;
    }

    public int getAndar() {
        return andar;
    }

    public Predio getPredio() {
        return predio;
    }

    //Métodos set
    public void setId(Long id) {
        this.id = id;
    }

    public void setNumeroApartamento(int numeroApartamento) {
        this.numeroApartamento = numeroApartamento;
    }

    public void setBloco(String bloco) {
        this.bloco = bloco;
    }

    public void setAndar(int andar) {
        this.andar = andar;
    }

    public void setPredio(Predio predio) {
        this.predio = predio;
    }
}
