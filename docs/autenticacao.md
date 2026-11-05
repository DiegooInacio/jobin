# Autenticação de desenvolvimento

A entrega 5 usa Supabase Auth para autenticar e PostgreSQL local para os dados
próprios do Jobin. Não é necessário copiar o banco de produção nem usar chaves
privilegiadas. Não há cadastro público, OAuth ou recuperação de senha nesta entrega.

## Criando o projeto

1. Criar um projeto exclusivo para desenvolvimento no
   [painel do Supabase](https://supabase.com/dashboard).
2. Nas configurações de API/Connect, copiar a URL do projeto. Em
   **Settings > API Keys**, copiar a chave **Publishable** (`sb_publishable_...`).
   Se necessário, criar uma chave publicável nessa tela. Não usar a chave
   `service_role`, a chave secreta (`sb_secret_...`) ou a senha do banco.
3. Em **Authentication**, manter o login por e-mail e senha habilitado.
   Para uso pessoal, desabilitar a criação pública de contas nas configurações
   de autenticação; as contas iniciais serão criadas no painel.
4. Em **Authentication > Users**, usar a opção de criação de usuário com e-mail e
   senha, com o e-mail confirmado. Criar duas contas de teste para conferir isolamento.
   Usar uma senha própria para desenvolvimento, sem compartilhá-la no chat ou no Git.
5. Configurar a URL do site de desenvolvimento como `http://localhost:3000`.
   O login desta entrega usa senha, sem callback de OAuth ou links por e-mail.

Referências oficiais: [chaves de API](https://supabase.com/docs/guides/getting-started/api-keys),
[usuários](https://supabase.com/docs/guides/auth/users) e
[login por senha](https://supabase.com/docs/guides/auth/passwords).

## Configurando o Jobin

Manter as URLs PostgreSQL já configuradas na entrega 4. Adicionar ao `.env` local:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_sua_chave_publicavel
```

Os nomes públicos não significam credenciais administrativas. O código desta entrega
usa o SDK somente no servidor e no middleware. Não existe cliente Supabase no navegador.
Os cookies de sessão são HttpOnly, SameSite=Lax e Secure em produção.

Não sobrescrever seu `.env` existente com o exemplo. Não criar uma segunda cópia
com valores diferentes em `.env.local`, pois ela tem precedência no Next.js.
Reiniciar `pnpm run dev` depois de alterar variáveis de ambiente.

```bash
pnpm install
pnpm db:up
pnpm db:migrate
pnpm run dev
```

A instalação precisa atualizar `pnpm-lock.yaml` com os pacotes Supabase.
Após atualizar e revisar o lockfile, usar `pnpm install --frozen-lockfile` nas
instalações seguintes.

Abrir <http://localhost:3000/login>. Sem sessão, qualquer página do Jobin redireciona
para o login. Sem configuração do Supabase, o formulário fica indisponível e nenhuma
página privada é liberada. O banco local precisa estar disponível para sincronizar
`users` no login. O build não faz login nem abre conexões com o banco.

## Identidade, dados e autorização

- Senhas e identidades ficam no Supabase Auth; não são persistidas pelo Jobin.
- O backend usa `auth.getUser()` para confirmar a identidade com o provedor,
  em vez de confiar em um usuário decodificado do cookie ou em `getSession()`.
- O UUID confirmado é sincronizado em `users` com inserção idempotente.
- Não há foreign key para `auth.users`: o PostgreSQL local e o Supabase Auth
  pertencem a bancos distintos. O vínculo é o UUID retornado pelo Auth.
- A tabela local permanece com RLS habilitada e sem políticas de acesso direto.
  O backend verifica o proprietário mesmo com conexão PostgreSQL privilegiada.
- `GET /api/conta/<uuid>` retorna apenas a conta da sessão atual: 401 sem
  autenticação; 404 para outra conta ou conta ausente. As respostas não usam
  cache compartilhado. O UUID pode ser conferido na lista de usuários do Supabase.
- O middleware executa em Node.js, compatível com o SDK Supabase nesta stack.
  Ele renova cookies, protege navegação direta e mantém os cookies
  atualizados inclusive nos redirecionamentos. O layout e a rota de dados também
  verificam autenticação no servidor.
- Login, logout e consulta da conta não aceitam um proprietário enviado pelo formulário.
  Os próximos módulos devem reutilizar a identidade confirmada em toda operação.
- O logout encerra a sessão do navegador atual. Se houver falha, a interface
  apresenta o erro e permite tentar novamente, sem afirmar que a sessão foi encerrada.

Não foram necessárias novas migrations: esta entrega utiliza o esquema validado na
entrega 4. O quadro ainda exibe exemplos fictícios compartilhados de demonstração,
sem dados reais de candidaturas. O isolamento implementado se aplica à conta.

## Testando

```bash
pnpm run test:auth
pnpm db:test:up
pnpm test
pnpm run check
```

Os testes de autenticação usam respostas controladas e não consultam o Supabase.
Os testes de integração usam apenas `TEST_DATABASE_URL` no banco `jobin_test`.
O CI não precisa de contas, chaves ou senhas do Supabase.

Para conferir no navegador:

1. Abrir `/perfil` em uma janela anônima: deve ir para `/login?next=/perfil`.
2. Tentar uma senha incorreta: deve aparecer erro sem revelar detalhes do provedor.
3. Entrar com a primeira conta: deve ir ao perfil e mostrar o e-mail no cabeçalho.
4. Atualizar a página: a sessão deve continuar válida.
5. Consultar `/api/conta/<uuid-da-primeira-conta>`: deve retornar somente `id` e `createdAt`.
6. Consultar o UUID da segunda conta na mesma sessão: deve retornar 404.
7. Clicar em “Sair”, depois abrir `/` ou voltar e atualizar uma página privada:
   o conteúdo deve exigir login novamente. O cache de navegação é invalidado ao sair.
8. Repetir o acesso com a segunda conta e confirmar o isolamento nos dois sentidos.
9. Conferir o formulário em desktop e celular, por teclado, e testar mostrar/ocultar senha.

A inspeção de renovação de sessão real depende da configuração do projeto Supabase.
Revogar refresh tokens não significa invalidar imediatamente todos os access tokens:
eles têm validade própria, conforme o comportamento do provedor.
