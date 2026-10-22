# 🏢 SindiPro

> Sistema de gestão condominial para síndicos — projeto final do bootcamp **+PraTI Fullstack**.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Java](https://img.shields.io/badge/Java-17+-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-6DB33F?logo=springboot)
![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)

## 📌 Sobre o projeto

O **SindiPro** é uma aplicação web fullstack que centraliza a administração de um condomínio em um único painel. O síndico consegue organizar prédios, andares e unidades, manter o cadastro de moradores, controlar vagas de garagem e registrar encomendas recebidas na portaria.

O objetivo é substituir planilhas e anotações soltas por um sistema simples, organizado e acessível pelo navegador.

## 🎓 Contexto acadêmico

Projeto desenvolvido como **trabalho final do bootcamp +PraTI Fullstack**, aplicando na prática os conteúdos do curso:

- Desenvolvimento de **API REST** em Java com Spring Boot
- Modelagem e persistência de dados em banco relacional (PostgreSQL + JPA)
- Construção de interfaces com **React** e estilização com framework CSS
- Integração frontend ↔ backend e consumo de APIs
- Versionamento com Git e boas práticas de organização de código

## ✨ Funcionalidades

- [ ] Cadastro de **prédios** (blocos/torres)
- [ ] Cadastro de **unidades** por prédio e andar
- [ ] Cadastro de **moradores** vinculados às unidades
- [ ] Controle de **vagas de garagem** por unidade
- [ ] Registro e baixa de **encomendas** da portaria
- [ ] Painel com visão geral do condomínio

## 🛠️ Tecnologias

| Camada | Tecnologias |
|---|---|
| **Backend** | Java, Spring Boot, Spring Data JPA, Bean Validation, Maven |
| **Banco de dados** | PostgreSQL |
| **Frontend** | React, Vite, Tailwind CSS, Axios |
| **Ferramentas** | Git, GitHub, Postman/Insomnia |

## 🗂️ Estrutura do repositório

```
SindiPro/
├── backend/    # API REST (Java + Spring Boot)
└── frontend/   # Interface web (React + Vite + Tailwind)
```

## 🧩 Modelo de domínio

```
Predio 1 ── N Unidade 1 ── N Morador
                  │
                  ├── N VagaGaragem
                  └── N Encomenda
```

## 🚀 Como executar

> Instruções detalhadas serão adicionadas conforme o desenvolvimento avança.

### Pré-requisitos
- Java 17+
- Node.js 18+
- PostgreSQL

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 👨‍💻 Autor

**Matheus Brunetti Macedo**
Estudante de Análise e Desenvolvimento de Sistemas e do bootcamp +PraTI Fullstack.

[![GitHub](https://img.shields.io/badge/GitHub-mbrunettimacedodev-181717?logo=github)](https://github.com/mbrunettimacedodev)
