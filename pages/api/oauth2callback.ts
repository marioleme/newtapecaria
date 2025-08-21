// pages/api/oauth2callback.ts - VERSÃO CORRIGIDA
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;
  if (!code || typeof code !== "string") {
    return res.status(400).send("Missing code");
  }

  try {
    // LINHA CORRIGIDA AQUI
    const redirectUri = process.env.OAUTH_REDIRECT_LOCAL || "http://localhost:3000/api/oauth2callback";

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri, // Agora está correto
        grant_type: "authorization_code",
      }),
    });
    const tokens = await tokenRes.json() as any;
    const { refresh_token, access_token } = tokens;

    if (!refresh_token) {
      return res
        .status(200)
        .send("Login OK, mas não veio refresh_token. Tente revogar o acesso no Google e gerar de novo.");
    }

    res.status(200).json({
      message: "SUCESSO! Copie este refresh_token para o .env.local e Vercel",
      refresh_token,
      access_token_preview: access_token ? access_token.slice(0, 10) + "..." : null,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).send("Falha no OAuth callback");
  }
}