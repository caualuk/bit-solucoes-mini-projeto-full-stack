# Portal de Solicitações

Sistema web para abrir e acompanhar solicitações internas de uma empresa, como pedidos para TI, atualizações no RH, compras e infraestrutura.

O projeto é dividido em duas partes:

- `portal-solicitacoes/`: API desenvolvida em Java + Spring Boot
- `frontend/`: interface desenvolvida em Next.js + React + TypeScript

O banco utilizado é PostgreSQL. Para rodar localmente, você pode usar um PostgreSQL instalado na máquina ou um projeto no Supabase.

Para conhecer as decisões técnicas do projeto, veja o [Memorial Técnico](./MEMORIAL_TECNICO.md).

A documentação dos endpoints está em [docs/API.md](./docs/API.md).

# Pré-requisitos

- *Java 25 (JDK)*
- *Node.js 20.9 ou superior*
- *PostgreSQL 14 ou superior*, local ou via Supabase

O Maven não precisa ser instalado separadamente. O projeto já possui o `mvnw` (Maven Wrapper).

> *Importante:* o projeto deve ser executado com Java 25. Durante o desenvolvimento, o Java 27 apresentou incompatibilidade com o Lombok.

# Instalação

# 1. Banco de dados

Você pode usar PostgreSQL local ou Supabase.

# PostgreSQL local

Crie o banco:

```sql
CREATE DATABASE portal_solicitacoes;
```

Não é necessário criar as tabelas. O Spring Boot faz isso quando a aplicação é iniciada.

# Supabase

Crie um projeto no [Supabase](https://supabase.com) e acesse:

*Project Settings → Database → Connection string*

Use a conexão *Session pooler*. Esses dados vão nas variáveis de ambiente do backend (veja em [Configuração](#configuração)).

# 2. Backend

Entre na pasta do backend e instale as dependências:

```bash
cd portal-solicitacoes
./mvnw clean install -DskipTests
```

No Windows:

```cmd
mvnw.cmd clean install -DskipTests
```

# 3. Frontend

```bash
cd frontend
npm install
```

# Configuração

# Variáveis de ambiente

O backend lê as configurações direto das variáveis de ambiente. Não existe arquivo `.env`.

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DB_URL` | sim | Endereço JDBC do banco |
| `DB_USERNAME` | sim | Usuário do banco |
| `DB_PASSWORD` | sim | Senha do banco |
| `JWT_SECRET` | sim | Chave usada para assinar os tokens JWT. Deve ter pelo menos 32 caracteres. |
| `JWT_EXPIRATION` | não | Tempo de validade do token em milissegundos. O padrão é 24 horas (`86400000`). |
| `CORS_ALLOWED_ORIGINS` | não | Endereços permitidos para acessar a API. O padrão é `http://localhost:3000`. |

Os valores de banco mudam conforme a opção escolhida:

| | PostgreSQL local | Supabase |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/portal_solicitacoes` | `jdbc:postgresql://aws-0-<regiao>.pooler.supabase.com:5432/postgres?sslmode=require` |
| `DB_USERNAME` | `postgres` | `postgres.<id-do-projeto>` |
| `DB_PASSWORD` | senha do seu Postgres | senha do banco no Supabase |

# Pelo IntelliJ

É assim que eu rodo o projeto.

1. Abra a pasta `portal-solicitacoes` no IntelliJ.
2. Vá em *Run → Edit Configurations* e selecione `PortalSolicitacoesApplication`.
3. No campo *Environment variables*, cole a linha abaixo, trocando os valores pelos seus:

```text
DB_URL=jdbc:postgresql://localhost:5432/portal_solicitacoes;DB_USERNAME=postgres;DB_PASSWORD=sua-senha;JWT_SECRET=troque-por-uma-chave-com-32-ou-mais-caracteres
```

4. Confira se o *JDK* da configuração é o 25.

As variáveis opcionais podem ficar de fora.

# Pelo terminal

Se preferir rodar pelo terminal, defina as variáveis na mesma sessão em que vai iniciar o backend.

Linux / macOS / Git Bash:

```bash
export DB_URL=jdbc:postgresql://localhost:5432/portal_solicitacoes
export DB_USERNAME=postgres
export DB_PASSWORD=sua-senha
export JWT_SECRET=troque-por-uma-chave-com-32-ou-mais-caracteres
```

Windows (PowerShell):

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/portal_solicitacoes"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="sua-senha"
$env:JWT_SECRET="troque-por-uma-chave-com-32-ou-mais-caracteres"
```

# Frontend

Por padrão, o frontend espera encontrar a API em:

```text
http://localhost:8080
```

Se a API estiver em outro endereço, crie `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://endereco-da-sua-api
```

# Executando o projeto

O backend e o frontend precisam estar rodando ao mesmo tempo.

# Backend

Pelo IntelliJ, basta rodar a configuração `PortalSolicitacoesApplication` (botão ▶).

Pelo terminal, com as variáveis já definidas:

```bash
cd portal-solicitacoes
./mvnw spring-boot:run
```

A API ficará disponível em:

```text
http://localhost:8080
```

No Windows:

```cmd
mvnw.cmd spring-boot:run
```

# Frontend

Em outro terminal:

```bash
cd frontend
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

# Testando a aplicação

Depois de iniciar os dois projetos, acesse:

```text
http://localhost:3000
```

O banco começa vazio, então o primeiro passo é criar um usuário: na tela de login, clique em **Criar conta**, escolha um nome de usuário e uma senha com pelo menos 6 caracteres. Depois do cadastro, o login é feito automaticamente.

Um fluxo simples para testar as principais funcionalidades:

1. Crie uma nova solicitação.
2. Abra os detalhes da solicitação.
3. Altere o status para **Em Atendimento**.
4. Verifique que as opções de edição e exclusão ficam bloqueadas.
5. Volte para a lista e teste os filtros.
6. Acesse o dashboard para conferir os números atualizados.

# Testes

# Backend

```bash
cd portal-solicitacoes
./mvnw test
```

Atualmente existem **14 testes** no backend.

Os testes utilizam H2, portanto não precisam de um PostgreSQL nem das variáveis de ambiente.

# Frontend

```bash
cd frontend
npm test
```

Atualmente existem **9 testes** no frontend.

# Problemas comuns

# `ExceptionInInitializerError` ao compilar

Confira se o projeto está usando **Java 25** e se o `JAVA_HOME` aponta para o JDK correto.

# Erro de conexão com o banco

Verifique:

- se o PostgreSQL está rodando;
- se `DB_URL`, `DB_USERNAME` e `DB_PASSWORD` estão corretos;
- se estiver usando Supabase, se foi utilizada a conexão **Session pooler**.

A conexão direta do Supabase pode não funcionar em redes sem IPv6.

# Erro de CORS

Confira se o endereço do frontend está incluído em:

```env
CORS_ALLOWED_ORIGINS
```

Por exemplo:

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000
```