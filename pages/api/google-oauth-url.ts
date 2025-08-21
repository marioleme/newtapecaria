// pages/api/google-oauth-url.ts
// ESTE ARQUIVO JÁ ESTÁ CORRETO. NENHUMA ALTERAÇÃO NECESSÁRIA.

import type { NextApiRequest, NextApiResponse } from "next";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Garanta que suas variáveis de ambiente (.env.local) estão configuradas
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.OAUTH_REDIRECT_URI || "http://localhost:3000/api/google-oauth-url";

  if (!clientId) {
    res.status(500).json({ error: "Google Client ID não está configurado no servidor." });
    return;
  }
  
  const scope = "https://www.googleapis.com/auth/photoslibrary.readonly";

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scope,
    access_type: "offline",
    prompt: "consent", // Força a tela de consentimento a aparecer sempre, útil para desenvolvimento
  });

  const url = `${AUTH_URL}?${params.toString()}`;

  // Redireciona o navegador do usuário para a página de login do Google
  res.redirect(302, url);
}