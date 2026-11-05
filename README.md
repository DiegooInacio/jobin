# Jobin

Aplicação web pessoal para descobrir vagas compatíveis com o perfil profissional e acompanhar candidaturas, entrevistas e versões do currículo.

## Estado do projeto

Estrutura visual implementada (entrega 3), com navegação entre candidaturas,
vagas, perfil e currículos. O quadro usa dados fictícios identificados como
demonstração, com busca e filtro locais. A conferência visual em desktop e celular
está pendente. Cadastro, autenticação e persistência serão implementados nas
próximas entregas.

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

Acesse <http://localhost:3000>. Nenhuma variável de ambiente ou serviço externo
é necessário nesta entrega. Banco, Supabase e demais integrações serão
configurados nas respectivas entregas.

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

As configurações de testes de domínio, integração e fluxos serão introduzidas
com as funcionalidades correspondentes; esta entrega não contém regras de negócio.
Veja os registros de validação da [entrega 2](docs/validacao-entrega-2.md) e
da [entrega 3](docs/validacao-entrega-3.md).

## Documentação

- [Escopo do produto](docs/escopo.md)
- [Arquitetura inicial](docs/arquitetura.md)
- [Plano de entregas e validação](docs/entregas.md)

## Direção visual

O quadro de candidaturas segue a referência visual fornecida: navegação horizontal,
fundo neutro, cinco colunas por etapa, cartões compactos e filtros.
As visualizações alternativas em lista e tabela serão adicionadas na entrega 10. A tela “Vagas para você” será separada do acompanhamento de candidaturas. A interface será responsiva e em português brasileiro.

## Convenção de commits

Usar o formato `tipo: descrição em português brasileiro`, com tipos como `docs`, `chore`, `feat`, `fix`, `refactor` e `test`. Cada commit deve representar uma entrega coerente e validada.

Entregas 1 e 2 concluídas: documentação inicial e configuração da aplicação.
A entrega 3, `feat: adiciona estrutura visual do Jobin`, está implementada e
aguarda a conferência visual antes do commit.
