package br.com.sindipro.sindipro.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

@Entity
@Table(name = "morador")
public class Morador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "O morador precisa estar em uma unidade")
    @ManyToOne
    @JoinColumn(name = "unidade_id")
    private Unidade unidade;

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    // Aceita 000.000.000-00 ou só os 11 números.
    // A regra "CPF não pode repetir" NÃO fica aqui: ela precisa consultar o banco, então mora no MoradorService.
    @NotBlank(message = "O CPF é obrigatório")
    @Pattern(regexp = "\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}", message = "CPF inválido (use 000.000.000-00)")
    private String cpf;

    @Min(value = 0, message = "A idade não pode ser negativa")
    @Max(value = 130, message = "Idade inválida")
    private int idade;

    // BigDecimal (e não double) porque é dinheiro. Pode ser null: proprietário não paga aluguel.
    @PositiveOrZero(message = "O valor do aluguel não pode ser negativo")
    private BigDecimal valorAluguel;

    // Boolean (com B maiúsculo) aceita null: inquilino não tem posse.
    private Boolean temPosse;

    // "INQUILINO" ou "PROPRIETARIO". Mantivemos a tabela única que você já criou no banco.
    @NotBlank(message = "O tipo é obrigatório")
    @Pattern(regexp = "INQUILINO|PROPRIETARIO", message = "O tipo deve ser INQUILINO ou PROPRIETARIO")
    private String tipo;

    public Morador() {
    }

    //Métodos get
    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getCpf() {
        return cpf;
    }

    public int getIdade() {
        return idade;
    }

    public BigDecimal getValorAluguel() {
        return valorAluguel;
    }

    public Boolean getTemPosse() {
        return temPosse;
    }

    public String getTipo() {
        return tipo;
    }

    public Unidade getUnidade() {
        return unidade;
    }

    //Métodos set
    public void setId(Long id) {
        this.id = id;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public void setIdade(int idade) {
        this.idade = idade;
    }

    public void setValorAluguel(BigDecimal valorAluguel) {
        this.valorAluguel = valorAluguel;
    }

    public void setTemPosse(Boolean temPosse) {
        this.temPosse = temPosse;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public void setUnidade(Unidade unidade) {
        this.unidade = unidade;
    }
}
