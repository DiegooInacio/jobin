# Escopo do produto

## Objetivo

Ajudar o usuário a encontrar oportunidades alinhadas ao seu perfil e manter um histórico confiável dos processos seletivos.

## Premissas

- Uso pessoal inicialmente, com autenticação e isolamento de dados por usuário.
- Interface web em português brasileiro, com acesso por desktop e celular.
- Referência visual: quadro Kanban enviado pelo usuário; o arquivo da imagem não integra o repositório.
- Recomendações limitadas à cobertura das fontes conectadas e às vagas adicionadas manualmente.

## Primeira versão utilizável

- Login e logout.
- Perfil profissional, habilidades e preferências.
- Cadastro manual de vagas com descrição, empresa, origem e link.
- Criação e acompanhamento de candidaturas.
- Quadro Kanban com histórico persistente das mudanças de etapa.

Critério de conclusão: entrar no sistema, preencher o perfil, cadastrar uma vaga, registrar a candidatura, movê-la de etapa e confirmar a persistência após recarregar a página.

## Evolução planejada

- Lista, tabela e filtros de candidaturas.
- Currículos privados e versões vinculadas às candidaturas.
- Entrevistas, contatos e anotações.
- Lembretes dentro da aplicação.
- Compatibilidade explicada por regras.
- Importação de vagas de empresas acompanhadas via Greenhouse e Lever.
- Feed personalizado, indicadores e exportação de dados.

## Fora do escopo inicial

- Candidatura automática em plataformas externas.
- Coleta universal de vagas ou dependência de endpoints não documentados.
- Aplicativos móveis nativos, cobrança e recursos de equipes.
- IA generativa como requisito para funcionamento.
- Notificações por e-mail ou push, até uma entrega específica.

## Regras essenciais

- Vaga salva não implica candidatura enviada; registrar a data de envio separadamente.
- Toda mudança de etapa gera histórico com data e proprietário.
- A versão de currículo vinculada à candidatura deve preservar o arquivo enviado.
- Informação ausente na vaga ou no perfil não equivale a incompatibilidade.
- Pontuação de aderência não representa probabilidade de contratação.
- Falha de coleta não implica encerramento de vaga.
- Remoção de anúncio externo não elimina candidaturas ou anotações.
- Conversões devem explicitar período, população, numerador e denominador.
