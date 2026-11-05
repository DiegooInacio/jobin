# Validação da entrega 5

Estado: **check e testes de autenticação aprovados; integração e conferência real pendentes; sem commit**.

## Implementação

- Login por e-mail e senha com Supabase Auth, erros genéricos e estado de envio.
- Formulário com e-mail/senha, preenchimento automático, controle de visibilidade
  da senha e configuração ausente tratada sem liberar acesso.
- Logout da sessão local, invalidação do cache de navegação e indicação de falha.
- SDK SSR por requisição, cookies HttpOnly, SameSite=Lax e Secure em produção.
- Renovação pelo middleware, proteção de páginas e API e preservação de cookies
  durante redirecionamentos. Destinos de retorno restritos às páginas do Jobin.
- Grupo de rotas privadas e nova consulta de conta por identificador, com
  autenticação e verificação de propriedade também no servidor.
- Sincronização idempotente do UUID confirmado pelo Supabase na tabela `users`.
- Testes de credenciais, configuração, ações, middleware, endpoint e isolamento.
- Instruções de criação e configuração do Supabase em `docs/autenticacao.md`.

Não há cadastro público, OAuth ou recuperação de senha. A aplicação não usa chave
privilegiada nem confia no conteúdo de cookies para autorizar leitura de dados.
As tabelas de negócio continuam reservadas às entregas futuras.

## Resultados disponíveis

- `pnpm run test:auth`: **39 testes aprovados**, em seis arquivos, com respostas
  controladas do provedor e do banco.
- `tests/db/environment.test.ts`: três testes aprovados.
- Lint e formatação conferidos com as ferramentas existentes.
- `git diff --check`.

## Limites

O bloqueio inicial de instalação foi superado com a instalação realizada pelo
usuário; o lockfile atualizado está disponível no workspace.

Após o relato de avisos do SDK Supabase no Edge Runtime, o middleware foi
configurado com `runtime: "nodejs"`, estável no Next.js 15.5. O SDK usa APIs
Node.js e a aplicação já tem esse requisito no backend PostgreSQL.

- `pnpm run check` aprovado: lint, tipos, formatação e build de produção.
- Build concluído sem os avisos de incompatibilidade com Edge.
- Cinco testes do middleware reexecutados e aprovados após o ajuste.
- Referência: <https://nextjs.org/blog/next-15-5#nodejs-middleware-stable>.

Os testes com PostgreSQL precisam ser executados no terminal do usuário, cujo
ambiente permite acessar o Docker; o agente não tem acesso ao socket.
`pnpm run test:db` aprovou os três testes de configuração, mas as duas suítes
com PostgreSQL falharam na conexão (`connect EPERM 127.0.0.1:5434`), antes
de executar seus sete testes. Não houve confirmação de acesso ao banco.
A abertura do navegador também é bloqueada no ambiente do agente.

A reorganização das páginas em `(protected)` pode deixar tipos antigos em caches
locais. Se a verificação de tipos apontar arquivos em `.next/types` ou
`.next-dev/types` referenciando os caminhos antigos, encerrar o servidor, remover
somente as pastas geradas `.next` e `.next-dev`, iniciar o desenvolvimento para
regenerar seus tipos e executar o build antes de repetir `pnpm run check`.
Essas pastas não contêm código-fonte ou dados de banco.

## Antes do commit

1. Seguir `docs/autenticacao.md` para criar o projeto e configurar o `.env` local.
2. Executar `pnpm install`, revisar o lockfile e confirmar `pnpm run check`.
3. Executar `pnpm db:test:up` e `pnpm test`, incluindo os testes de duas contas
   com PostgreSQL privilegiado em `tests/db/authorization.test.ts`.
4. Conferir login, logout, atualização da página e isolamento real entre as duas
   contas no navegador, seguindo o roteiro de autenticação.
5. Registrar os resultados e criar:

```bash
git add .
git commit -m "feat: adicionando autenticação e controle de acesso"
```
