# Cupcake Store

Projeto Integrador desenvolvido para o 8º semestre do curso de Engenharia de Software da Universidade Cruzeiro do Sul.

## Tecnologias

### Frontend

- Angular
- TypeScript
- SCSS

### Backend

- Node.js
- Express
- TypeScript
- SQLite

## Estrutura

- `cupcake-app` — aplicação web Angular
- `cupcake-api` — API REST e persistência de dados

## Funcionalidades

- Cadastro e autenticação de usuários
- Catálogo de cupcakes
- Carrinho de compras
- Finalização de pedidos
- Pagamento simulado
- Histórico de pedidos

## Instalação e execução

### Pré-requisitos

Para executar o projeto localmente é necessário ter instalado:

- Node.js 24
- npm

O projeto utiliza SQLite como banco de dados. Não é necessário instalar ou configurar um servidor de banco de dados separadamente.

### 1. Clonar o repositório

```bash
git clone https://github.com/zorkind/cupcake-store.git
cd cupcake-store
```

### 2. Configurar o backend

Acesse a pasta da API:

```bash
cd cupcake-api
```

Instale as dependências:

```bash
npm install
```

Crie a pasta utilizada pelo banco de dados:

```bash
mkdir data
```

Crie um arquivo `.env` dentro da pasta `cupcake-api`:

```env
JWT_SECRET=sua_chave_secreta
```

Uma chave aleatória pode ser gerada utilizando o próprio Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Compile o backend:

```bash
npm run build
```

Inicie a API:

```bash
npm start
```

A API estará disponível em:

```text
http://localhost:3000
```

O banco de dados SQLite, suas tabelas e os produtos iniciais serão criados automaticamente na primeira execução.

### 3. Configurar o frontend

Abra outro terminal e, a partir da raiz do projeto, acesse a pasta da aplicação:

```bash
cd cupcake-app
```

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm start
```

O endereço local da aplicação será informado pelo Angular no terminal.

## Aplicação publicada

A aplicação está disponível em:

https://cupcake.hellionrp.space

## Licença

Este projeto está licenciado sob a licença MIT.