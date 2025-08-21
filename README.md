# Tapeçaria José Antonio — Next.js + Google Photos (OAuth) + Shared Albums + Debug

## Rodar localmente
```bash
npm install
npm run dev
```
1) Crie **.env.local** a partir de **.env.local.example**.  
2) Abra `http://localhost:3000/api/google-oauth-url`, clique na URL, autorize e copie o `refresh_token` mostrado em `/api/google-oauth-url`.  
3) Cole o token no `.env.local` e reinicie `npm run dev`.

## Testes
- `http://localhost:3000/api/photos?limit=3` → deve retornar URLs do Google (`...=w1600`).  
- `http://localhost:3000/api/photos?debug=1` → mostra diagnóstico (motivo de fallback, álbum não encontrado, etc).

## Suporte a shared albums
O endpoint procura primeiro na **biblioteca** (`albums.list`) e depois em **compartilhados** (`sharedAlbums.list`).  
Dica: se o álbum for compartilhado, clicar **"Adicionar à biblioteca"** no Google Photos facilita.

## Deploy no Vercel
- Importe o repo do GitHub.
- Adicione as env vars do `.env.local` em Project → Settings → Environment Variables.
- Redeploy.

## Ajustes do front
- `components/App.tsx` já tem fallback robusto: se a API retornar `[]` ou falhar, a galeria usa imagens de backup.
- Edite telefone/endereços e `FORMSPREE_ID` conforme necessário.
