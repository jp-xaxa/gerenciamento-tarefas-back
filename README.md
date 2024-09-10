### Projeto TaskEase

# Gerenciamento de Tarefas - Backend

## Descrição

Este é o backend da aplicação de gerenciamento de tarefas. Ele fornece uma API RESTful para o frontend, incluindo funcionalidades de autenticação e gerenciamento de tarefas.

## Tecnologias Utilizadas

- **Node.js** com **Express.js** para criar a API.
- **Knex** para gerenciamento de banco de dados.
- **SQLite** como banco de dados.
- **JWT (JSON Web Token)** para autenticação e autorização.
- **bcryptjs** para hash de senhas.
- **dotenv** para variáveis de ambiente.

## Funcionalidades

- **Cadastro de Usuário**: Permite registrar novos usuários com e-mail e senha.
- **Autenticação**: Login e logout de usuários utilizando JWT.
- **Gerenciamento de Tarefas**: CRUD (criação, leitura, atualização e exclusão) de tarefas.

## Instalação e Execução

1. Clone este repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>

2. Navegue até o diretório do backend:
  cd gerenciamento-tarefas-back

3. Instale as dependências:
  npm install

4. Execute as migrações do banco de dados: 
  npm run migrate

5. Inicie o servidor em modo desenvolvimento:
  npm run dev