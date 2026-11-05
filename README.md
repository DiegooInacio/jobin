# Jobin

Aplicação web pessoal para descobrir vagas compatíveis com o perfil profissional e acompanhar candidaturas, entrevistas e versões do currículo.

## Estado do projeto

Base técnica configurada (entrega 2): Next.js com App Router,
TypeScript, Tailwind CSS e verificações de qualidade. A página inicial contém
apenas uma identificação provisória. A estrutura visual e as funcionalidades
serão implementadas nas próximas entregas.

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

As configurações de testes de domínio, integração e fluxos serão introduzidas
com as funcionalidades correspondentes; esta entrega não contém regras de negócio.
Veja o [registro da validação da entrega 2](docs/validacao-entrega-2.md).

## Documentação

- [Escopo do produto](docs/escopo.md)
- [Arquitetura inicial](docs/arquitetura.md)
- [Plano de entregas e validação](docs/entregas.md)

## Direção visual

O quadro de candidaturas seguirá a referência visual fornecida: colunas por etapa, cartões compactos, filtros e visualizações alternativas em lista e tabela. A tela “Vagas para você” será separada do acompanhamento de candidaturas. A interface será responsiva e em português brasileiro.

## Convenção de commits

Usar o formato `tipo: descrição em português brasileiro`, com tipos como `docs`, `chore`, `feat`, `fix`, `refactor` e `test`. Cada commit deve representar uma entrega coerente e validada.

Entregas 1 e 2 concluídas: documentação inicial e configuração da aplicação.
A próxima entrega planejada é `feat: adiciona estrutura visual do Jobin`.
