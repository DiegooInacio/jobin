# Validação da entrega 4

Estado: **entrega 4 validada pelo usuário e commitada**.

Commit: `548bb23 feat: configurando banco e esquema inicial`.
O usuário informou que todos os comandos de validação passaram antes do commit.
Os bloqueios abaixo registram as limitações do ambiente do agente na ocasião.

## Escopo

- PostgreSQL 16 no Docker Compose, com volume persistente para desenvolvimento
  e instância temporária separada para testes. Portas restritas a `127.0.0.1`.
- `.env.example` com configuração local e credenciais fictícias.
- Drizzle ORM, configuração do Drizzle Kit, esquema e migration inicial.
- `users` com UUID obrigatório, chave primária, data de criação com fuso e
  preenchimento automático, e RLS habilitada. As políticas virão com a autenticação.
- Cliente PostgreSQL exclusivo do servidor, conexão criada sob demanda e pool
  reutilizado para evitar novas conexões a cada atualização do desenvolvimento.
- Testes Vitest para configuração, idempotência das migrations, inserção pelo
  esquema Drizzle, duplicidade, campos obrigatórios e estado inicial de RLS.
- Banco de teste obrigatório chamado `jobin_test`; nenhuma limpeza destrutiva
  do banco de desenvolvimento. Registros de teste são revertidos por transação.
- GitHub Actions com PostgreSQL vazio e execução dos testes.

Não foram criadas relações ou tabelas de negócio antecipadas. A primeira relação
com entidades de autenticação será introduzida na entrega 5. O UUID de `users`
será fornecido pelo Supabase Auth; a tabela não gera usuários autenticados sozinha.

## Limites da validação

O ambiente do agente não resolve `registry.npmjs.org` (`ENOTFOUND`) e não tem
acesso ao socket Docker (`operation not permitted`). A tentativa de resolução
isolada das dependências também falhou com `ERR_PNPM_META_FETCH_FAIL`.
O lockfile ainda não foi atualizado com as dependências desta entrega.
`pnpm run check` passou pelo lint e parou na verificação de tipos porque os
novos módulos ainda não estão instalados; o build não foi iniciado.

A migration e o snapshot foram preparados manualmente para o esquema mínimo.
Precisam ser conferidos pelo Drizzle Kit instalado antes de serem considerados
validados. Não há resultado aprovado de migrations, testes Vitest, tipos ou build
para esta entrega enquanto essas dependências não estiverem instaladas.

## Verificações parciais

- `docker compose config --quiet`: configuração válida sem acessar o daemon.
- Formatação e lint verificados com as ferramentas existentes.
- Validação direta da proteção das URLs com o Node.js.
- Revisão de SQL, metadados, URLs locais e isolamento das bases.
- `git diff --check`.

## Para concluir antes do commit

1. Executar `cp .env.example .env` caso o arquivo local ainda não exista.
2. Executar `pnpm install` e revisar o `pnpm-lock.yaml` atualizado.
3. Executar `pnpm db:generate`: sem alteração do esquema, o Drizzle não deve
   gerar novas migrations. Se houver divergência, corrigir o snapshot inicial.
4. Executar `pnpm db:up` e `pnpm db:migrate` no banco local vazio.
5. Executar `pnpm db:test:up` e `pnpm test`. A primeira execução deve ocorrer
   na instância temporária nova, confirmando migrations em banco vazio.
6. Executar `pnpm run check`; conferir o resultado do CI após o envio.
7. Registrar os resultados e criar o commit:

```bash
git add .
git commit -m "feat: configurando banco e esquema inicial"
```
