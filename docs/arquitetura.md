# Arquitetura inicial

## Decisão

Usar um monólito modular: uma aplicação web com regras organizadas por funcionalidade e um worker quando surgirem tarefas assíncronas. Evitar serviços separados até existir uma necessidade concreta.

## Stack

| Responsabilidade              | Escolha                                |
| ----------------------------- | -------------------------------------- |
| Interface e backend           | Next.js com App Router e TypeScript    |
| Componentes e estilos         | Tailwind CSS e shadcn/ui               |
| Interação do Kanban           | dnd-kit                                |
| Banco de dados                | PostgreSQL                             |
| Esquema e migrations          | Drizzle ORM e Drizzle Kit              |
| Autenticação                  | Supabase Auth                          |
| Arquivos privados             | Supabase Storage                       |
| Validação                     | Zod                                    |
| Testes de regras e integração | Vitest e PostgreSQL dedicado a testes  |
| Testes de interface e fluxos  | Testing Library e Playwright           |
| Qualidade                     | ESLint, Prettier e TypeScript          |
| Banco local                   | Docker Compose                         |
| Integração contínua           | GitHub Actions, se hospedado no GitHub |

O gerenciador de pacotes é o pnpm, com versão definida no campo `packageManager`
do `package.json` e dependências fixadas no `pnpm-lock.yaml` após a instalação.

As versões compatíveis serão escolhidas no bootstrap e fixadas no arquivo de dependências e no lockfile. Provedor de hospedagem e custos ainda não foram definidos.

O PostgreSQL local atende desenvolvimento e testes de domínio. Os fluxos de autenticação e arquivos exigirão configuração Supabase de desenvolvimento; testes automatizados não devem depender de credenciais ou dados de produção.

## Organização proposta

```text
src/
  app/                 # Páginas, layouts e endpoints
  modules/
    profile/
    jobs/
    applications/
    resumes/
    matching/
    reminders/
    analytics/
  components/ui/
  db/
  integrations/
  workers/
docs/
```

A interface chama os casos de uso dos módulos. Integrações externas normalizam os dados antes de entregá-los ao domínio. Regras de negócio não ficam em componentes visuais.

## Modelo conceitual

- Usuário possui perfil, habilidades e preferências.
- Empresa publica vagas; a vaga registra origem, identificador externo, URL e datas de coleta.
- Candidatura liga usuário e vaga, com etapa atual e data de envio opcional.
- Histórico de etapas registra cada transição da candidatura.
- Versão de currículo contém referência a arquivo privado e pode ser vinculada à candidatura.
- Entrevistas, contatos e notas pertencem ao contexto da candidatura.
- Análise de compatibilidade registra entradas utilizadas, versão do cálculo e explicações.
- Fonte acompanhada identifica o quadro externo da empresa; execuções de importação registram sucesso, falhas e atualização.
- Lembrete registra vencimento, fuso horário e estado de entrega.

O modelo físico será detalhado nas migrations. Não criar todas as tabelas antecipadamente: introduzir cada conjunto junto à funcionalidade correspondente.

## Autorização e arquivos

Verificar autenticação e propriedade em todas as operações do servidor. Acesso direto por identificador também deve ser protegido. Arquivos de currículo ficam em armazenamento privado, com acesso autorizado e temporário. Credenciais privilegiadas permanecem no servidor.

Definir políticas RLS para dados acessíveis pelo Supabase; não presumir que elas protegem conexões privilegiadas do backend. Validar tamanho e tipo de upload. Segredos não entram no Git.

## Tarefas e importações

Persistir tarefas no PostgreSQL, com estado, tentativas, agendamento e erros. Projetar execução idempotente e proteção contra processamento concorrente. Introduzir o worker na entrega de lembretes e reutilizá-lo nas importações.

Conectores iniciais: Greenhouse e Lever, por empresa acompanhada. Respeitar condições e limites de cada fonte. Deduplicar primeiro por fonte e identificador externo; tratar correspondências entre fontes com critérios conservadores. Inferir encerramento apenas após coleta completa bem-sucedida e conforme o contrato da fonte.

## Compatibilidade

Aplicar preferências e restrições e depois calcular aderência explicável por regras. Distinguir requisitos atendidos, não atendidos e desconhecidos. Persistir versão do cálculo e as entradas necessárias para reproduzir o resultado. Avaliar IA posteriormente com exemplos reais e critérios de qualidade.

## Referências das tecnologias e fontes

- Next.js: https://nextjs.org/docs
- Drizzle: https://orm.drizzle.team/docs/overview
- Supabase: https://supabase.com/docs
- Greenhouse: https://docs.greenhouse.io/job-board
- Lever: https://github.com/lever/postings-api
