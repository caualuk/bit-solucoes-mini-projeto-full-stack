# Portal de Solicitações — Backend

API REST do Portal de Solicitações (Java 25 · Spring Boot 4 · Spring Security/JWT · JPA · PostgreSQL).

> Documentação completa (instalação do sistema inteiro, credenciais, API, testes): **[README principal](../README.md)**.
> Decisões técnicas: **[Memorial Técnico](../MEMORIAL_TECNICO.md)**.

## Pré-requisitos

- **JDK 25** (versões mais novas não compilam por causa do Lombok)
- PostgreSQL 14+ (local ou Supabase)
- Maven não é necessário: use o wrapper `mvnw` / `mvnw.cmd`

## Configuração

Defina as variáveis de ambiente na configuração de execução do IntelliJ (*Run → Edit Configurations → Environment variables*) ou no terminal:

| Variável           | Exemplo                                                  |
|--------------------|----------------------------------------------------------|
| `DB_URL`           | `jdbc:postgresql://localhost:5432/portal_solicitacoes`   |
| `DB_USERNAME`      | `postgres`                                               |
| `DB_PASSWORD`      | `postgres`                                               |
| `JWT_SECRET`       | string com 32+ caracteres                                |
| `JWT_EXPIRATION`   | `86400000` (opcional, 24 h)                              |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000` (opcional — endereço do frontend) |

## Comandos

```bash
./mvnw spring-boot:run     # executa em http://localhost:8080 (Windows: mvnw.cmd)
./mvnw test                # 14 testes, usa H2 em memória (não precisa de banco)
./mvnw clean package       # gera target/portal-solicitacoes-0.0.1-SNAPSHOT.jar
```

## Acesso

O banco começa vazio. Crie um usuário pela opção **Criar conta** na tela de login.
