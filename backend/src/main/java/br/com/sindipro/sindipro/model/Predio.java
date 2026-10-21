package br.com.sindipro.sindipro.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "predio")
public class Predio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // NOVO: validações. Se o JSON chegar sem "rua", a API responde 400 antes de tocar no banco.
    @NotBlank(message = "A rua é obrigatória")
    private String rua;

    @NotBlank(message = "O bairro é obrigatório")
    private String bairro;

    @NotBlank(message = "A cidade é obrigatória")
    private String cidade;

    // Aceita 12345-678 ou 12345678.
    // @NotBlank + @Pattern juntos: o @Pattern sozinho deixa passar valor ausente (null), por isso precisa do @NotBlank.
    @NotBlank(message = "O CEP é obrigatório")
    @Pattern(regexp = "\\d{5}-?\\d{3}", message = "CEP inválido (use 12345-678)")
    private String cep;

    @NotBlank(message = "O nome do condomínio é obrigatório")
    private String nomeCondominio;

    @Positive(message = "O número do condomínio deve ser maior que zero")
    private int numeroCondominio;

    public Predio() {
    }

    //Métodos get
    public Long getId() {
        return id;
    }

    public String getRua() {
        return rua;
    }

    public String getBairro() {
        return bairro;
    }

    public String getCidade() {
        return cidade;
    }

    public String getCep() {
        return cep;
    }

    public String getNomeCondominio() {
        return nomeCondominio;
    }

    public int getNumeroCondominio() {
        return numeroCondominio;
    }

    //Métodos set
    public void setId(Long id) {
        this.id = id;
    }

    public void setRua(String rua) {
        this.rua = rua;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public void setNomeCondominio(String nomeCondominio) {
        this.nomeCondominio = nomeCondominio;
    }

    public void setNumeroCondominio(int numeroCondominio) {
        this.numeroCondominio = numeroCondominio;
    }
}
