# Entregas e validação

Cada linha representa um commit planejado. Dividir entregas maiores em commits funcionais quando necessário. Mensagens em português brasileiro.

| Ordem | Commit                                                   | Validação principal                                                             |
| ----- | -------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 1     | `docs: define escopo e arquitetura inicial do Jobin`     | Links locais, consistência do escopo e revisão documental.                      |
| 2     | `chore: configura aplicação e verificações de qualidade` | Lint, tipos, build e execução local.                                            |
| 3     | `feat: adiciona estrutura visual do Jobin`               | Navegação e conferência visual em desktop e celular.                            |
| 4     | `feat: configura banco e esquema inicial`                | Migrations em banco vazio, relações e restrições.                               |
| 5     | `feat: adiciona autenticação e controle de acesso`       | Login, logout e bloqueio de acesso entre usuários.                              |
| 6     | `feat: gerencia perfil profissional`                     | Validação, persistência e edição.                                               |
| 7     | `feat: gerencia vagas salvas`                            | Cadastro, edição, consulta, exclusão e dados inválidos.                         |
| 8     | `feat: acompanha candidaturas e histórico de etapas`     | Transições, datas, histórico e isolamento.                                      |
| 9     | `feat: adiciona quadro Kanban de candidaturas`           | Movimentação, persistência, alternativa acessível ao arraste e falha ao salvar. |
| 10    | `feat: adiciona lista e tabela de candidaturas`          | Busca, filtros e consistência entre visualizações.                              |
| 11    | `feat: gerencia versões de currículo`                    | Upload, acesso privado e preservação da versão enviada.                         |
| 12    | `feat: acompanha entrevistas e anotações`                | Datas, fuso horário e vínculos.                                                 |
| 13    | `feat: adiciona tarefas assíncronas e lembretes`         | Agendamento, repetição, concorrência e prevenção de duplicatas.                 |
| 14    | `feat: explica compatibilidade com vagas`                | Aderência, incompatibilidade e informação ausente.                              |
| 15    | `feat: estrutura importação de vagas`                    | Normalização, idempotência, deduplicação e falhas parciais.                     |
| 16    | `feat: importa vagas do Greenhouse`                      | Contrato com respostas controladas e consulta real controlada.                  |
| 17    | `feat: importa vagas do Lever`                           | Contrato, paginação e falhas da fonte.                                          |
| 18    | `feat: adiciona vagas recomendadas para o perfil`        | Preferências, ordenação, descarte e atualização do perfil.                      |
| 19    | `feat: adiciona indicadores de candidaturas`             | Populações conhecidas, períodos, ausência de dados e cálculos.                  |
| 20    | `feat: exporta dados pessoais`                           | Integridade e autorização de exportação.                                        |

## Critérios antes de cada commit

1. Revisar o diff e garantir escopo coerente e ausência de segredos.
2. Executar lint, tipos e testes relevantes quando houver código e ferramentas configuradas.
3. Conferir visualmente alterações de interface.
4. Executar build após mudanças de aplicação ou configuração.
5. Corrigir falhas e registrar as verificações executadas antes de criar o commit.

Commits exclusivamente documentais exigem revisão documental e de links, sem testes de aplicação. Testes de integração usam banco dedicado; conectores usam respostas controladas. Consultas reais são verificações complementares e não devem tornar a suíte dependente de serviços externos.

## Marcos

- Commit 9: núcleo utilizável com perfil, vagas, candidaturas e Kanban.
- Commit 14: acompanhamento com currículos, entrevistas, lembretes e compatibilidade.
- Commit 18: descoberta automática nas fontes conectadas e feed personalizado.
- Commit 20: indicadores e portabilidade dos dados.

Publicação da aplicação terá entrega própria, com configuração de ambientes, migrations, backup e verificação do ambiente publicado. Criar commits não implica publicar automaticamente.
