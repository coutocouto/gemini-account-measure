# Measure Account App

um leitor de medições de água e gás usando o Gemini

## Tecnologias usadas

- **TypeScript**:
- **Nest.js**
- **Gemini-API (https://ai.google.dev/gemini-api/docs/vision?hl=pt-br&lang=node)**
- **Sequelize**
- **Docker**
- **Clean Architecture**
- **MySql**

### Pré-requisitos

- Docker e Docker Compose

### Instalação

Clone o repositório:

```bash
git clone https://github.com/coutocouto/gemini-account-measure
cd gemini-account-measure
```

### Configuração

Copie o env.example para um .env e preencha o valor de GEMINI_API_KEY

```bash
cp .env.example .env
```

### Rodando a aplicação

Suba os containers do Docke

```bash
docker-compose up -d
```

### Acessando a aplicação

- A Aplicação vai estar rodando em: [http://localhost:80](http://localhost:80)
- Acesse a documentação da API em : [http://localhost:80/api/](http://localhost:80/api/)
