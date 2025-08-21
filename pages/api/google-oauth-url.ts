// pages/api/google-oauth-url.ts
import type { NextApiRequest, NextApiResponse } from "next";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  
  // LINHA CORRIGIDA AQUI
  const redirectUri = process.env.OAUTH_REDIRECT_LOCAL || "http://localhost:3000/api/oauth2callback";

  if (!clientId) {
    res.status(500).json({ error: "Google Client ID não está configurado no servidor." });
    return;
  }
  
 const scope = "https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/photoslibrary.sharing";

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scope,
    access_type: "offline",
    prompt: "consent",
  });

  const url = `${AUTH_URL}?${params.toString()}`;

  res.redirect(302, url);
}