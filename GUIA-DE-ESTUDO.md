# SindiPro — Projeto de referência (para estudar e imitar)

Esta pasta é uma versão COMPLETA do SindiPro feita para você **consultar**, não para copiar e colar.
A ideia: abrir um arquivo, ler os comentários, perguntar o que não entendeu, e **escrever o seu** no seu repositório.
Nada aqui mexe no seu GitHub. Esta pasta fica separada.

## Aviso importante sobre o que foi testado

- **Frontend:** `npm install` e `npm run build` rodaram sem erro.
- **Backend:** NÃO consegui compilar nem rodar. O ambiente onde eu trabalhei bloqueia o download das dependências Maven.
  O código foi revisado à mão, mas pode ter um erro de compilação que eu não vi.
  **Rode primeiro o teste na sua máquina** (ele usa banco em memória, não precisa do Supabase):
  `cd backend` e `./mvnw test` (ou o botão de rodar ao lado da classe `FluxoCompletoApiTest`, no IntelliJ).
  Se der erro, cole o final do console aqui que a gente corrige.
- O frontend nunca falou com o backend de verdade. O primeiro teste de integração é seu.

## O que mudou em relação ao seu repositório

| Onde | O que mudou | Por quê |
|---|---|---|
| `pom.xml` | + `spring-boot-starter-validation`, + `h2` (test) | validação e testes sem Supabase |
| `model/*` | anotações `@NotBlank`, `@Pattern`, `@Positive`... | recusar dados ruins antes do banco |
| `model/VagaGaragem`, `Encomenda` | entidades novas | 2º Andar do cronograma |
| `repository/*` | métodos `existsBy...`, `findBy...` | o Spring monta o SQL pelo nome do método |
| `service/*` | `criar`/`atualizar` separados, regras de negócio | a lógica mora no Service |
| `exception/*` | exceções + `TratadorDeExcecoes` | respostas 400/404/409 organizadas |
| `config/CorsConfig` | libera o `localhost:5173` | o React conseguir chamar a API |
| `sql/schema.sql` | tabelas `vaga_garagem` e `encomenda` + CHECK | o banco de verdade precisa delas |
| `frontend/` | React + Tailwind completo | 3º Andar do cronograma |

## Ordem sugerida para você imitar (um commit por passo)

Cada passo é pequeno. Faça sozinho, depois compare com a referência e me pergunte as diferenças.

**1º Andar (faltando)**
1. `UnidadeService` e `UnidadeController` — mesma receita do Prédio.
   Commit: `feat: adiciona CRUD de unidade` (feat porque é funcionalidade nova)

**2º Andar**
2. `VagaGaragem`: model, repository, service, controller (relação OPCIONAL: sem `@NotNull`).
   Antes, rode o SQL da tabela `vaga_garagem` do `sql/schema.sql` no Supabase.
   Commit: `feat: adiciona entidade e CRUD de vaga de garagem`
3. `Encomenda`: o mesmo, com a data de retirada começando nula.
   Commit: `feat: adiciona entidade e CRUD de encomenda`
4. CRUD de `Morador` (Service e Controller).
   Commit: `feat: adiciona CRUD de morador`
5. Validação: dependência no `pom.xml` + anotações nos models + `@Valid` nos controllers.
   Commit: `feat: adiciona validação de dados nas entidades`
6. Exceções: as duas exceções + `TratadorDeExcecoes`, e troque o `.orElse(null)` por `orElseThrow`.
   Commit: `refactor: centraliza tratamento de erros da API` (refactor porque muda como o erro é tratado, sem mudar o que o sistema faz)
7. CPF único: `existsByCpf` no repository + checagem no `MoradorService`.
   Commit: `feat: impede cadastro de morador com CPF duplicado`

**Cobertura (regras)**
8. Não apagar com filhos: `existsByPredioId`, `existsByUnidadeId`, `existsByMoradorId`.
   Commit: `feat: bloqueia exclusão de registros que possuem dependentes`

**3º Andar (frontend)**
9. `npm create vite@latest frontend -- --template react`, instalar o Tailwind, `api.js`, CORS no backend.
   Commit: `chore: inicia frontend com Vite, React e Tailwind` (chore porque é configuração, não funcionalidade)
10. Uma tela por vez: Prédios → Unidades → Moradores → Vagas → Encomendas → Painel.
    Commit para cada: `feat: adiciona tela de ...`
11. Estilo/responsividade: `style: ...` só se mudar visual sem mexer na lógica.

## Onde estão as ideias mais importantes (leia estes primeiro)

1. `service/MoradorService.java` — regras de negócio (CPF único, tipo, unidade existe).
2. `exception/TratadorDeExcecoes.java` — como um erro vira JSON para o React.
3. `frontend/src/api.js` — o único arquivo que fala com a API.
4. `frontend/src/pages/Moradores.jsx` — formulário completo (estado, validação, selects, erro do backend).
5. `model/VagaGaragem.java` — como fica uma relação opcional.

## Como rodar

**Banco:** rode `backend/sql/schema.sql` no Supabase (só as tabelas que você ainda não tem). Opcional: `dados-exemplo.sql`.

**Backend:** configure `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` (variáveis de ambiente do IntelliJ) e rode `SindiproApplication`.
Para experimentar sem Supabase: `./mvnw spring-boot:run -Dspring-boot.run.profiles=h2 -Dspring-boot.run.useTestClasspath=true`

**Frontend:** `cd frontend`, `npm install`, `npm run dev` e abra `http://localhost:5173`.

## Endpoints

| Recurso | Rotas |
|---|---|
| Prédios | `GET/POST /predios`, `GET/PUT/DELETE /predios/{id}` |
| Unidades | `GET/POST /unidades`, `GET/PUT/DELETE /unidades/{id}` |
| Moradores | `GET/POST /moradores` (`?unidadeId=`), `GET/PUT/DELETE /moradores/{id}` |
| Vagas | `GET/POST /vagas` (`?unidadeId=`), `GET/PUT/DELETE /vagas/{id}` |
| Encomendas | `GET/POST /encomendas` (`?pendentes=true`, `?unidadeId=`), `PUT /encomendas/{id}/retirar`, `GET/PUT/DELETE /encomendas/{id}` |

Exemplo de corpo para criar uma unidade (note o `predio` como objeto):

```json
{ "bloco": "A", "andar": 1, "numeroApartamento": 101, "predio": { "id": 1 } }
```

## Como me perguntar

Abra um arquivo, escolha UMA linha que você não entendeu e pergunte: "por que essa linha existe?".
Se você tentar escrever o seu e der erro, cole o seu código e o erro. Eu corrijo apontando o que está errado, sem reescrever por você.
