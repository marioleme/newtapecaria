// pages/api/photos.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

// Fallback estático caso falhe OAuth/álbum
const staticPhotos = [
  { url: "images/banner-tapecaria-jose-antonio.jpg", alt: "Reforma de sofá – antes e depois" },
  { url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600", alt: "Estofaria residencial – poltrona" },
  { url: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600", alt: "Cadeiras restauradas" }
];

function hasEnv() {
  return !!(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN
  );
}

async function getOAuthClient() {
  const redirectUri =
    process.env.OAUTH_REDIRECT_PROD ||
    process.env.OAUTH_REDIRECT_LOCAL ||
    "http://localhost:3000/api/google-oauth-url";

  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );
  client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return client;
}

// -------- Helpers REST (sem o client photoslibrary) --------
async function gfetch(path: string, client: any, body?: any): Promise<any> {
  // Next.js (Node 18+) já tem fetch global
  const base = "https://photoslibrary.googleapis.com/v1/";
  const headers = await client.getRequestHeaders(); // inclui Authorization: Bearer ...
  const res = await fetch(base + path, {
    method: body ? "POST" : "GET",
    headers: body
      ? { ...headers, "Content-Type": "application/json" }
      : headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Photos API ${res.status}: ${txt}`);
  }
  return res.json();
}

async function listAlbums(client: any, pageSize = 50, pageToken?: string) {
  const qs = new URLSearchParams({ pageSize: String(pageSize) });
  if (pageToken) qs.set("pageToken", pageToken);
  return gfetch(`albums?${qs.toString()}`, client);
}

async function listSharedAlbums(client: any, pageSize = 50, pageToken?: string) {
  const qs = new URLSearchParams({ pageSize: String(pageSize) });
  if (pageToken) qs.set("pageToken", pageToken);
  return gfetch(`sharedAlbums?${qs.toString()}`, client);
}

async function searchByAlbumId(client: any, albumId: string, pageSize = 50, pageToken?: string) {
  return gfetch("mediaItems:search", client, {
    albumId,
    pageSize,
    pageToken,
  });
}

async function findAlbumId(client: any, title: string) {
  // 1) Biblioteca
  let pageToken: string | undefined;
  for (let i = 0; i < 10; i++) {
    const data = await listAlbums(client, 50, pageToken);
    const found = (data.albums ?? []).find((a: any) => a.title === title);
    if (found) return { id: found.id, shared: false };
    pageToken = data.nextPageToken || undefined;
    if (!pageToken) break;
  }
  // 2) Compartilhados
  pageToken = undefined;
  for (let i = 0; i < 10; i++) {
    const data = await listSharedAlbums(client, 50, pageToken);
    const found = (data.sharedAlbums ?? []).find((a: any) => a.title === title);
    if (found) return { id: found.id, shared: true };
    pageToken = data.nextPageToken || undefined;
    if (!pageToken) break;
  }
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const limit = Number(req.query.limit ?? 12);
  const debug = req.query.debug === "1";

  try {
    const title = process.env.GOOGLE_PHOTOS_ALBUM_TITLE || "";
    if (!hasEnv() || !title) {
      if (debug) return res.status(200).json({ reason: "missing_env_or_title", title, staticPhotos });
      return res.status(200).json(staticPhotos);
    }

    const client = await getOAuthClient();

    const found = await findAlbumId(client, title);
    if (!found) {
      if (debug) return res.status(200).json({ reason: "album_not_found", triedTitle: title, staticPhotos });
      return res.status(200).json(staticPhotos);
    }

    const items: any[] = [];
    let pageToken: string | undefined;
    while (items.length < limit) {
      const data = await searchByAlbumId(client, found.id, Math.min(50, limit - items.length), pageToken);
      (data.mediaItems ?? []).forEach((m: any) => items.push(m));
      pageToken = data.nextPageToken || undefined;
      if (!pageToken) break;
    }

    const result = items.slice(0, limit).map((m: any) => ({
      url: `${m.baseUrl}=w1600`,
      alt: m.filename || m.description || "Foto",
    }));

    if (debug) return res.status(200).json({ ok: true, shared: found.shared, count: result.length, sample: result.slice(0, 2) });
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=300");
    return res.status(200).json(result.length ? result : staticPhotos);
  } catch (e: any) {
    if (debug) return res.status(200).json({ reason: "exception", message: e?.message, staticFallback: true });
    return res.status(200).json(staticPhotos);
  }
}
