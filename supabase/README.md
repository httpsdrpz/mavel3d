# Configuração do Supabase

Passos únicos para ligar o catálogo de produtos ao seu projeto Supabase.

1. **Variáveis de ambiente** — preencha `.env.local` na raiz do projeto (já criado, só faltam os valores) com os dados em *Project Settings > API*:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (nunca exponha esse valor no client — só é lido em Server Actions)

2. **Schema** — no SQL Editor do Supabase, rode `supabase/schema.sql`. Isso cria a tabela `products`, a policy de leitura pública (só `active = true`) e o bucket `product-images` do Storage.

3. **Seed opcional** — rode `supabase/seed.sql` para popular a tabela com o mesmo catálogo que o app usava como mock. Sem isso o catálogo começa vazio (você cadastra pelo `/admin`). Rodar o seed também mantém os pedidos/clientes de exemplo (que ainda são mock, fora desta migração) resolvendo os nomes/imagens dos produtos corretamente.

4. **Usuário admin** — em *Authentication > Users*, crie um usuário (email + senha) para logar em `/admin/login`. Não há cadastro self-service; é só esse usuário que acessa o painel.

5. `npm run dev` e acesse `/admin/login`.

## Notas de arquitetura

- Leituras públicas (home, `/produtos`, `/produto/[id]`) usam a anon key e RLS restringe a `active = true` — `services/products.ts`.
- Leituras/escritas do admin usam a service role key (ignora RLS) e só rodam a partir de Server Actions protegidas por `requireAdminSession()` — `services/products-admin.ts` + `lib/supabase/admin.ts`.
- Login é Supabase Auth (email/senha) com o token de acesso guardado num cookie httpOnly; `proxy.ts` faz a checagem otimista (cookie existe?) e o layout `(protected)` faz a checagem completa (token válido no Supabase?).
- Categorias, clientes, pedidos, configurações e carrinho continuam em localStorage/mock — fora do escopo desta migração.
