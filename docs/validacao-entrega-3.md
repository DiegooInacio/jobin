# Validação da entrega 3

Estado: **entrega 3 aprovada pelo usuário e commitada**.

Commit: `e1b14f5 feat: adicionando estrutura visual do Jobin`.
O usuário confirmou a execução local e aprovou o visual após os ajustes.

## O que foi implementado

- Layout compartilhado com marca Jobin, navegação, cabeçalho horizontal.
- Rotas `/`, `/vagas`, `/perfil` e `/curriculos`, com indicação da página atual.
- Quadro visual de candidaturas com cinco etapas e onze cartões fictícios,
  explicitamente identificados como demonstração.
- Busca nos exemplos por cargo, empresa ou local, filtro por modelo de trabalho,
  contagem dos resultados, estado sem resultados e ação para limpar filtros.
- Páginas iniciais de vagas, perfil e currículos, indicando os recursos futuros.
- Layout compacto com navegação horizontal, cinco colunas em telas amplas e
  rolagem horizontal restrita ao quadro em telas menores.
- Tipografia Inter em WOFF2 local, pesos 400, 500 e 600, com licença em
  `src/app/fonts/OFL.txt`; não exige consulta a um provedor de fontes no build.
- Busca e seletor com altura consistente, ícones, bordas e foco destacados,
  indicação visual de filtro ativo e limpeza da busca com retorno do foco ao campo.
- Link para pular ao conteúdo, foco visível, campos com rótulos, anúncio da
  contagem dos resultados e respeito à preferência por movimento reduzido.

O visual foi revisado após a leitura da referência fornecida pelo usuário em
`/home/diego/Imagens/Screenshot from 2026-11-05 17-42-00.png`: navegação horizontal,
fundo branco, colunas cinza, cartões compactos e etiquetas discretas.
A imagem foi consultada localmente e não foi adicionada ao repositório.
Não foram adicionadas dependências.

## Limites desta entrega

Os dados de exemplo ficam no código e os filtros funcionam apenas em memória.
Não há criação, edição, exclusão, arraste, banco ou autenticação.
As páginas de vagas, perfil e currículos são estados de apresentação;
seus recursos serão adicionados nas entregas planejadas.
As visualizações em lista e tabela permanecem na entrega 10.

## Verificações automatizadas

- `pnpm run check`: lint sem avisos, tipos, formatação e build de produção.
- Revisão do HTML estático gerado para confirmar as quatro rotas, navegação e cartões.
- `git diff --check`: ausência de erros de espaços.

## Separação dos arquivos gerados

Após o relato de erro `TypeError: a[d] is not a function` durante o desenvolvimento,
foi identificada uma provável interferência entre o build de produção e o servidor
de desenvolvimento, que usavam a mesma pasta `.next/`. O erro não pôde ser
reproduzido no ambiente do agente, que bloqueia a abertura de portas locais.

A configuração agora usa `.next-dev/` no desenvolvimento e `.next/` no build e
na execução de produção. As ferramentas de qualidade e o Git ignoram ambas as
pastas; o TypeScript inclui os tipos de rotas gerados em cada modo.
É necessário reiniciar `pnpm run dev` para carregar a nova configuração.

## Conferência visual e interações

A tentativa de iniciar o Chrome pelo Playwright foi bloqueada pelo ambiente:
`setsockopt: Operation not permitted`, encerrando o navegador antes da abertura
de qualquer página. Não há resultado de teste visual ou de interação automatizado.

Para validar no terminal do usuário:

1. Executar `pnpm run dev` e abrir <http://localhost:3000>.
2. Conferir as quatro rotas pelo menu e o destaque da página selecionada.
3. Buscar `aurora` no quadro: deve restar um cartão em “Vagas salvas”.
4. Limpar os filtros e selecionar “Remoto”: devem aparecer seis cartões.
5. Buscar um termo inexistente: a contagem deve ficar em zero e as etapas devem
   apresentar o estado vazio. Usar “Limpar filtros” deve restaurar os onze cartões.
6. Conferir a interface em desktop, em 768 px e em celular (390 px e 320 px),
   sem rolagem horizontal da página; o quadro tem sua própria rolagem horizontal.
7. Conferir a fonte Inter e os novos campos: abrir o seletor pelo teclado,
   escolher um modelo e verificar o destaque de filtro ativo. Digitar uma busca,
   usar o botão “Limpar busca” e conferir o retorno do foco ao campo.
8. Navegar pelo teclado, verificar o foco visível e usar o link “Pular para o conteúdo”.

O roteiro acima permanece como referência para futuras verificações de interface.
