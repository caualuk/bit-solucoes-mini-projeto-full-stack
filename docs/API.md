# Referência da API

Base: `http://localhost:8080`

Login e cadastro são públicos. As demais rotas exigem o cabeçalho `Authorization: Bearer <token>`.

## Autenticação

| Método | Rota | Descrição |
|---|---|---|
| POST | `/v1/auth/login` | Recebe `{ username, password }` e retorna `{ token }` |
| POST | `/v1/auth/register` | Cadastra um usuário; a senha precisa ter no mínimo 6 caracteres |
| POST | `/v1/auth/logout` | Encerra a sessão (o cliente descarta o token) |

## Solicitações

| Método | Rota | Descrição |
|---|---|---|
| GET | `/v1/requests` | Lista paginada, com filtros |
| GET | `/v1/requests/{id}` | Detalhe de uma solicitação |
| GET | `/v1/requests/dashboard` | Totais por status |
| POST | `/v1/requests` | Cria uma solicitação: `{ title, description, category }` |
| PUT | `/v1/requests/{id}` | Edita uma solicitação (somente com status Aberto) |
| PATCH | `/v1/requests/{id}/status?status=...` | Altera o status |
| DELETE | `/v1/requests/{id}` | Exclui uma solicitação (somente com status Aberto) |

Filtros da listagem, todos opcionais:

- `title`, `category`, `status`
- `startDate` e `endDate`, no formato `2026-10-05T00:00:00`
- `page`, `size`, `sort` (exemplo: `sort=createdAt,desc`)

Valores aceitos:

- **category:** `IT`, `HR`, `PROCUREMENT`, `FINANCE`, `INFRASTRUCTURE`
- **status:** `OPEN`, `IN_PROGRESS`, `COMPLETED`

Códigos de erro:

- `400`: dados inválidos ou regra de negócio violada (a mensagem vem no corpo da resposta)
- `401`: requisição sem login
- `404`: solicitação não encontrada
