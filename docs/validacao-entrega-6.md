# Validação da entrega 6

Estado: **implementação pronta; integração e conferência visual pendentes; sem commit**.

## Implementação

- Perfil privado em `/perfil`, com cadastro, carregamento e edição persistentes.
- Nome completo, título profissional, localização, apresentação e experiência.
- Habilidades, LinkedIn, GitHub e portfólio.
- Cargos e localidades de interesse, modelos de trabalho, tipos de contratação e
  remuneração mínima mensal bruta em BRL.
- Nome e título obrigatórios; demais campos opcionais. Listas são normalizadas e
  deduplicadas sem perder a ordem. Ausência de informação não vira zero ou restrição.
- Validação no servidor de limites, opções permitidas, URLs HTTP(S) sem credenciais
  e valores monetários. A remuneração é convertida para centavos sem arredondamento.
- Formulário responsivo com rótulos, erros por campo, foco no primeiro erro,
  indicação de alterações não salvas e bloqueio durante envio. Os dados digitados
  são preservados em falhas de validação ou persistência.
- Em caso de sessão expirada, nenhuma gravação ocorre e há link para entrar novamente.
- Migration gerada pelo Drizzle, com um perfil por usuário, FK para `users`,
  remoção em cascata, enums, restrições e RLS habilitada, sem acesso público direto.
- Leitura e gravação usam o UUID da sessão confirmada; campos de proprietário ou
  datas enviados pelo formulário não entram na persistência.
- A edição mantém um único perfil por usuário, preserva a data de criação e
  atualiza a data de edição.
- Conexões ociosas interrompidas no pool não encerram o processo; erros das operações
  continuam sendo tratados pelo caso de uso, sem expor detalhes do banco.

Não foram adicionadas dependências. As validações ficam no módulo de perfil e
são cobertas por testes.
Não há cadastro de vagas, candidaturas, upload de currículo ou cálculo de aderência.

## Verificações executadas

- `pnpm run check`: lint, tipos, formatação e build de produção aprovados.
- `pnpm run test:profile`: 31 testes de validação, casos de uso e ações aprovados.
- `pnpm test`: 73 testes sem dependência de conexão aprovados, incluindo os
  testes anteriores de autenticação e configuração de banco.
- `tests/db/client.test.ts`: teste adicional do tratamento de conexão ociosa
  aprovado separadamente, sem conexão real.
- `pnpm db:generate --name=adicionando_perfil_profissional`: migration gerada.
- Nova execução de `db:generate`: nenhuma divergência ou migration adicional.
- `git diff --check`.

## Correção dos formulários de autenticação e perfil

Os dois formulários foram migrados de `ReactDOM.useFormState` para
`React.useActionState`, disponível no React fornecido pelo App Router do Next.js.
Não foi necessário instalar dependências. Lint, tipos, formatação e build passaram
após a troca; 70 testes de autenticação e perfil foram executados com sucesso.

O bloqueio do login relatado pelo usuário também foi diagnosticado: a variável
local `NEXT_PUBLIC_SUPABASE_URL` continha a URL do painel, em vez da Project URL.
A configuração local foi corrigida e validada sem exibir a chave. Nenhum valor
real de configuração foi incluído no Git. Foi adicionado um teste de regressão
para URLs do painel e de endpoints.

## Limites do ambiente

As três suítes com PostgreSQL falharam na conexão `127.0.0.1:5434` com `EPERM`.
Seus 19 testes não foram executados, incluindo 12 novos testes de perfil.
Isso impede confirmar a aplicação real da migration, restrições, persistência
ou isolamento no banco a partir do ambiente do agente.

Os testes novos cobrem cadastro e recarga, edição sem duplicação, isolamento
entre duas contas, proprietário e datas forjados, preservação após dados inválidos,
FK, restrições, unicidade, remoção em cascata e RLS. A suíte deve ser executada
completa no terminal do usuário antes do commit.

A abertura do navegador também está bloqueada para o agente. A conferência visual
em desktop e celular permanece pendente.

## Como testar

```bash
pnpm db:up
pnpm db:migrate
pnpm db:test:up
pnpm test
pnpm run check
pnpm run dev
```

1. Entrar com uma conta e abrir `/perfil`. No primeiro acesso, o formulário deve
   estar vazio, com experiência não informada e preferências sem seleção.
2. Preencher nome e cargo. Adicionar habilidades como `React, react, TypeScript`
   e localidades como `Fortaleza, CE; São Paulo, SP`. Informar `8500,99` na
   remuneração e salvar. A duplicata de React deve desaparecer sem perder TypeScript.
3. Atualizar a página: os dados devem continuar preenchidos. Navegar para outra
   página e voltar também deve recarregar os dados do banco.
4. Editar o título, limpar uma preferência e salvar novamente. Atualizar e
   confirmar a alteração, sem criar um segundo perfil.
5. Tentar salvar nome composto só por espaços, remuneração `-1` ou um link
   `javascript:alert(1)`. Não deve haver gravação; os campos devem indicar o erro.
   O navegador pode bloquear uma URL inválida antes do envio, e o servidor também
   valida os dados se essa verificação for contornada.
6. Sair e entrar com uma segunda conta. Ela deve ter um perfil próprio, sem os
   dados da primeira. Editar o segundo perfil e confirmar que o primeiro não mudou.
7. Conferir o formulário em desktop, 768 px, 390 px e 320 px. Navegar por teclado,
   verificar rótulos e erros, e confirmar que não há rolagem horizontal da página.
8. Opcionalmente, com o formulário aberto e alterações digitadas, parar apenas
   o banco de desenvolvimento com `docker compose stop db`. Tentar salvar: deve
   aparecer erro sem perder os valores digitados. Executar `pnpm db:up` e tentar
   novamente. Não remover volumes nem usar o banco de produção para esse teste.

A remuneração fica em `minimum_salary_cents`; `8500,99` deve resultar em `850099`.
A chave primária `user_id` impede mais de um perfil por conta. O banco de testes
é separado do banco que contém os perfis criados no navegador.

Após todas as validações:

```bash
git add .
git commit -m "feat: gerenciando perfil profissional"
```
