-- SindiPro: script completo do banco (PostgreSQL / Supabase).
-- A ORDEM importa: uma tabela só pode referenciar (FOREIGN KEY) outra que JÁ existe.
-- predio -> unidade -> morador -> vaga_garagem e encomenda (que dependem de unidade/morador).

CREATE TABLE predio (
    id SERIAL PRIMARY KEY,
    rua VARCHAR(100) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    cep VARCHAR(9) NOT NULL,
    nome_condominio VARCHAR(100) NOT NULL,
    numero_condominio INTEGER NOT NULL
);

CREATE TABLE unidade (
    id SERIAL PRIMARY KEY,
    bloco VARCHAR(10) NOT NULL,
    andar INTEGER NOT NULL,
    numero_apartamento INTEGER NOT NULL,
    predio_id INTEGER NOT NULL,
    FOREIGN KEY (predio_id) REFERENCES predio(id)
);

CREATE TABLE morador (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    idade INTEGER NOT NULL,
    unidade_id INTEGER NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    valor_aluguel NUMERIC(10,2),
    tem_posse BOOLEAN,
    FOREIGN KEY (unidade_id) REFERENCES unidade(id)
);

-- NOVA: vaga de garagem. unidade_id SEM "NOT NULL" = relação opcional (vaga pode estar livre).
-- CHECK: o banco também protege o valor de "tipo"-style: aqui, só aceita 'coberta' true/false (boolean já garante).
CREATE TABLE vaga_garagem (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(10) NOT NULL,
    coberta BOOLEAN NOT NULL DEFAULT FALSE,
    unidade_id INTEGER,
    FOREIGN KEY (unidade_id) REFERENCES unidade(id)
);

-- NOVA: encomenda. data_retirada sem NOT NULL: fica vazia enquanto o morador não busca.
CREATE TABLE encomenda (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(200) NOT NULL,
    remetente VARCHAR(100),
    data_recebimento TIMESTAMP NOT NULL,
    data_retirada TIMESTAMP,
    morador_id INTEGER NOT NULL,
    FOREIGN KEY (morador_id) REFERENCES morador(id)
);

-- Proteção extra no banco: mesmo que alguém insira direto por SQL, o tipo continua válido.
ALTER TABLE morador
    ADD CONSTRAINT ck_morador_tipo CHECK (tipo IN ('INQUILINO', 'PROPRIETARIO'));
