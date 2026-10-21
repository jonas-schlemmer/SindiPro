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

import java.time.LocalDateTime;

@Entity
@Table(name = "encomenda")
public class Encomenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "A descrição é obrigatória")
    private String descricao;

    private String remetente;

    // Quando chegou na portaria. O Service preenche com "agora" se não vier no JSON.
    private LocalDateTime dataRecebimento;

    // Enquanto for null, a encomenda ainda NÃO foi retirada. Quando o morador pega, vira a data/hora da retirada.
    // (Mesma ideia do data_devolucao do exercício da biblioteca: null = "ainda em aberto".)
    private LocalDateTime dataRetirada;

    @NotNull(message = "A encomenda precisa ser de um morador")
    @ManyToOne
    @JoinColumn(name = "morador_id")
    private Morador morador;

    public Encomenda() {
    }

    //Métodos get
    public Long getId() {
        return id;
    }

    public String getDescricao() {
        return descricao;
    }

    public String getRemetente() {
        return remetente;
    }

    public LocalDateTime getDataRecebimento() {
        return dataRecebimento;
    }

    public LocalDateTime getDataRetirada() {
        return dataRetirada;
    }

    public Morador getMorador() {
        return morador;
    }

    //Métodos set
    public void setId(Long id) {
        this.id = id;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public void setRemetente(String remetente) {
        this.remetente = remetente;
    }

    public void setDataRecebimento(LocalDateTime dataRecebimento) {
        this.dataRecebimento = dataRecebimento;
    }

    public void setDataRetirada(LocalDateTime dataRetirada) {
        this.dataRetirada = dataRetirada;
    }

    public void setMorador(Morador morador) {
        this.morador = morador;
    }
}
