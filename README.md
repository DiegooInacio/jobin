# Jobin

Aplicação web pessoal para descobrir vagas compatíveis com o perfil profissional e acompanhar candidaturas, entrevistas e versões do currículo.

## Estado do projeto

Entregas 1 a 5 commitadas. A entrega 6 implementa cadastro, consulta e edição do
perfil profissional, habilidades, links e preferências, com dados privados por
conta. As verificações de qualidade passaram; os testes com PostgreSQL e a
conferência no navegador ainda precisam ser concluídos. O quadro continua usando
exemplos fictícios, sem cadastro de vagas ou candidaturas reais.

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

Acesse <http://localhost:3000/login>. As páginas agora exigem uma sessão válida.
Configure o Supabase seguindo o [guia de autenticação](docs/autenticacao.md) e mantenha
o PostgreSQL de desenvolvimento disponível para sincronizar a conta no login.
O build não exige um projeto Supabase ou conexão PostgreSQL.

## Banco de dados local

Requisito adicional: Docker com Compose e acesso ao daemon.

```bash
cp -n .env.example .env
pnpm install --frozen-lockfile
pnpm db:up
pnpm db:migrate
```

Os comandos não sobrescrevem dados existentes. O PostgreSQL de desenvolvimento
usa a porta 5433 e um volume persistente. As credenciais do exemplo são apenas
para ambiente local. Se alterar usuário, senha ou portas, ajuste também as URLs.
O Compose lê `.env`; evite duplicar essas variáveis em `.env.local`.

O esquema contém `users` e `professional_profiles`, relacionados pelo UUID
fornecido pela autenticação. Ambas as tabelas têm RLS habilitada, sem políticas
de acesso direto. O backend confirma a identidade no Supabase e restringe as
consultas ao proprietário da sessão. As demais tabelas serão introduzidas junto
às funcionalidades correspondentes.
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

## Perfil profissional

Após entrar, abrir **Meu perfil** (`/perfil`). Nome e título profissional são
obrigatórios. Apresentação, localização, nível, habilidades, links e preferências
são opcionais. Os dados são salvos no PostgreSQL local e pertencem somente à conta
conectada. O e-mail de acesso continua sendo gerenciado pela autenticação.

Antes de abrir a página com esta entrega, aplicar a migration do perfil:

```bash
pnpm db:up
pnpm db:migrate
pnpm db:test:up
pnpm test
pnpm run check
pnpm run dev
```

Não há novas dependências para instalar nesta entrega. A migration
`0001_adicionando_perfil_profissional.sql` cria o perfil ligado a `users` por UUID.

As habilidades e cargos aceitam itens separados por vírgula, ponto e vírgula ou
linha. Nas localidades, usar ponto e vírgula ou uma localidade por linha para
preservar nomes como `Fortaleza, CE`. Itens repetidos são normalizados no salvamento.
A remuneração mínima é mensal, bruta e em reais; usar `8500,00`, sem milhar.
Em branco significa não informado; não equivale a zero nem a incompatibilidade.

`pnpm run test:profile` executa os testes do perfil sem banco. `pnpm test` inclui
a persistência e o isolamento com PostgreSQL dedicado. Veja o
[roteiro da entrega 6](docs/validacao-entrega-6.md).

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
e `pnpm test`. Use `pnpm run test:auth` para os testes de autenticação com respostas
controladas, sem depender de Supabase real. Veja os registros de validação das entregas
[2](docs/validacao-entrega-2.md), [3](docs/validacao-entrega-3.md),
[4](docs/validacao-entrega-4.md), [5](docs/validacao-entrega-5.md) e
[6](docs/validacao-entrega-6.md).

## Documentação

- [Escopo do produto](docs/escopo.md)
- [Arquitetura inicial](docs/arquitetura.md)
- [Plano de entregas e validação](docs/entregas.md)
- [Configuração da autenticação](docs/autenticacao.md)

## Direção visual

O quadro de candidaturas segue a referência visual fornecida: navegação horizontal,
fundo neutro, cinco colunas por etapa, cartões compactos e filtros.
As visualizações alternativas em lista e tabela serão adicionadas na entrega 10. A tela “Vagas para você” será separada do acompanhamento de candidaturas. A interface será responsiva e em português brasileiro.

## Convenção de commits

Usar o formato `tipo: descrição em português brasileiro`, com o verbo no gerúndio, com tipos como `docs`, `chore`, `feat`, `fix`, `refactor` e `test`. Cada commit deve representar uma entrega coerente e validada.

Entregas 1 a 5 commitadas. A entrega 6, `feat: gerenciando perfil profissional`,
aguarda testes de integração e conferência no navegador antes do commit.
