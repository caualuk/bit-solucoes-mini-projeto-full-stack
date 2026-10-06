# Portal de Solicitações — Frontend

Interface web do Portal de Solicitações (TypeScript · Next.js 16 · React 19 · Tailwind CSS 4).

> Documentação completa (instalação do sistema inteiro, credenciais, API, testes): **[README principal](../README.md)**.
> Decisões técnicas: **[Memorial Técnico](../MEMORIAL_TECNICO.md)**.

## Pré-requisitos

- Node.js 20.9+ (com npm)
- Backend rodando em `http://localhost:8080` (ver `../portal-solicitacoes`)

## Configuração (opcional)

A API padrão é `http://localhost:8080`. Para outro endereço:

```bash
cp .env.example .env.local    # e edite NEXT_PUBLIC_API_URL
```

## Comandos

```bash
npm install        # instala as dependências
npm run dev        # desenvolvimento em http://localhost:3000
npm run build      # build de produção
npm start          # servidor de produção (após o build)
npm test           # testes unitários (Vitest)
npm run lint       # ESLint
```

> O endereço do frontend precisa estar na variável `CORS_ALLOWED_ORIGINS` do backend (padrão: `http://localhost:3000`).

## Acesso

O banco começa vazio. Crie um usuário pela opção **Criar conta** na tela de login.
