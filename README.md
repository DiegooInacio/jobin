# Jobin

Aplicação web pessoal para descobrir vagas compatíveis com o perfil profissional e acompanhar candidaturas, entrevistas e versões do currículo.

## Estado do projeto

Estrutura visual implementada e aprovada (entrega 3). A entrega 4 prepara
PostgreSQL local, Drizzle, migration inicial e testes de banco. A instalação das
novas dependências e os testes de integração ainda precisam ser concluídos.
O quadro continua usando exemplos fictícios; autenticação e cadastros serão
implementados nas próximas entregas.

## Desenvolvimento local

Requisitos: Node.js 22.21.1 (definido em `.nvmrc`) e pnpm 9.15.9.
Com nvm instalado, execute `nvm install` e `nvm use` na raiz do projeto.
Ative o pnpm com `corepack enable` e confira `pnpm --version`; o campo
`packageManager` do `package.json` define a versão utilizada.

As dependências estão fixadas no `pnpm-lock.yaml`. Use a instalação com
`--frozen-lockfile` para preservar as versões, como no fluxo de integração contínua.

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

Acesse <http://localhost:3000>. A interface de demonstração pode ser aberta sem
banco. Para trabalhar na persistência, siga a configuração abaixo. O Supabase será
configurado na entrega de autenticação.

## Banco de dados local

Requisito adicional: Docker com Compose e acesso ao daemon.

```bash
cp .env.example .env
pnpm install
pnpm db:up
pnpm db:migrate
```

A primeira instalação desta entrega precisa usar `pnpm install` para atualizar
`pnpm-lock.yaml` com as dependências adicionadas; depois use `--frozen-lockfile`.
Os comandos não sobrescrevem dados existentes. O PostgreSQL de desenvolvimento
usa a porta 5433 e um volume persistente. As credenciais do exemplo são apenas
para ambiente local. Se alterar usuário, senha ou portas, ajuste também as URLs.
O Compose lê `.env`; evite duplicar essas variáveis em `.env.local`.

O esquema inicial contém somente `users`, com UUID fornecido pela autenticação,
data de criação e RLS habilitada, sem políticas de acesso públicas nesta fase.
As relações e tabelas de negócio serão introduzidas junto às funcionalidades.
A aplicação acessará o banco pelo módulo de servidor `src/db/client.ts`.

Para criar migrations após uma alteração no esquema:

```bash
pnpm db:generate --name=descrevendo_alteracao
pnpm db:migrate
```

As migrations e seus metadados em `drizzle/` devem ser versionados juntos.
Não use sincronização direta do esquema para substituir migrations.

Para testar usando um PostgreSQL separado e temporário:

```bash
pnpm db:test:up
pnpm test
```

`TEST_DATABASE_URL` precisa apontar para `jobin_test`, na porta 5434 por padrão.
Os testes aplicam migrations nesse banco e usam transações com rollback para os
registros de teste. Não usam `DATABASE_URL`, não apagam o banco de desenvolvimento
e não exigem Supabase. No CI, o serviço PostgreSQL nasce vazio a cada execução.

Use `pnpm db:test:down` para parar o serviço de testes e `pnpm db:down` para parar
os serviços do Compose. O volume de desenvolvimento é preservado.

## Verificações de qualidade

```bash
pnpm run lint         # ESLint, regras do Next.js e TypeScript
pnpm run typecheck    # Verificação estrita de tipos
pnpm run format:check # Conferência de formatação
pnpm run build        # Compilação de produção
pnpm run check        # Todas as verificações acima, em sequência
```

Use `pnpm run format` para aplicar a formatação. Após o build, execute
`pnpm start` para verificar a aplicação em modo de produção.
O GitHub Actions executará as mesmas verificações em pushes e pull requests.
O fluxo usa o lockfile para reproduzir a instalação.

O desenvolvimento usa `.next-dev/`; o build e `pnpm start` usam `.next/`.
Essa separação evita que uma verificação de build sobrescreva os arquivos
usados por um servidor de desenvolvimento aberto em outro terminal.

Execute `pnpm test` com o banco dedicado disponível para conferir migrations,
restrições e proteção da configuração de testes. O CI executa `pnpm run check`
e `pnpm test`. Veja os registros de validação das entregas
[2](docs/validacao-entrega-2.md), [3](docs/validacao-entrega-3.md) e
[4](docs/validacao-entrega-4.md).

## Documentação

- [Escopo do produto](docs/escopo.md)
- [Arquitetura inicial](docs/arquitetura.md)
- [Plano de entregas e validação](docs/entregas.md)

## Direção visual

O quadro de candidaturas segue a referência visual fornecida: navegação horizontal,
fundo neutro, cinco colunas por etapa, cartões compactos e filtros.
As visualizações alternativas em lista e tabela serão adicionadas na entrega 10. A tela “Vagas para você” será separada do acompanhamento de candidaturas. A interface será responsiva e em português brasileiro.

## Convenção de commits

Usar o formato `tipo: descrição em português brasileiro`, com o verbo no gerúndio, com tipos como `docs`, `chore`, `feat`, `fix`, `refactor` e `test`. Cada commit deve representar uma entrega coerente e validada.

Entregas 1 a 3 concluídas. A entrega 4, `feat: configurando banco e esquema inicial`,
está preparada e aguarda instalação e validação completa antes do commit.
