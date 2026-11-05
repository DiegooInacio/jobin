# Validação da entrega 2

Estado: **entrega 2 validada**.

## Escopo preparado

- Next.js com App Router, React, TypeScript estrito e alias `@/*` para `src/*`.
- Tailwind CSS pelo plugin PostCSS, layout em português brasileiro e página provisória.
- Versões diretas fixadas no `package.json`, lockfile `pnpm-lock.yaml`, Node.js em `.nvmrc` e pnpm declarado.
- ESLint com regras do Next.js e TypeScript, Prettier e EditorConfig.
- Scripts de desenvolvimento, produção e verificação conjunta por `pnpm run check`.
- GitHub Actions para instalação reproduzível e execução das verificações.
- Exclusão de dependências, builds, arquivos locais e segredos do versionamento.

## Resultados

Em 5 de novembro de 2026, com Node.js 22.21.1 e pnpm 9.15.9,
`pnpm run check` terminou com sucesso:

- ESLint sem erros ou avisos.
- TypeScript com `tsc --noEmit` aprovado.
- Prettier sem diferenças de formatação.
- Build de produção do Next.js aprovado, com geração estática da página inicial.
- `git diff --check` sem problemas de espaços.
- Execução local confirmada pelo usuário no navegador, com o conteúdo
  “Jobin” e “Aplicação em desenvolvimento.”.

Foram corrigidas as exportações anônimas nas configurações do ESLint e do
PostCSS, atribuindo os valores a constantes antes de exportá-los.

## Limitação do ambiente

O bloqueio inicial de instalação foi superado com a instalação realizada pelo
usuário; as dependências e o lockfile agora estão disponíveis no workspace.

A tentativa de executar `pnpm run dev --hostname 127.0.0.1 --port 3100`
falhou ao abrir a porta: `listen EPERM: operation not permitted`.
O ambiente de execução do agente não permite iniciar o servidor local.
A execução no navegador foi validada pelo usuário em seu terminal.
A conferência específica em celular e a execução com `pnpm start` não foram
confirmadas; o build de produção foi validado pelo agente.
