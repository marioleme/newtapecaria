// pages/api/photos.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

const staticPhotos = [
  { url: "https://images.unsplash.com/photo-1582582621952-e0d4ba01f3a5?q=80&w=1600", alt: "Reforma de sofá – antes e depois" },
  { url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600", alt: "Estofaria residencial – poltrona" },
  { url: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600", alt: "Cadeiras restauradas" }
];

function hasOAuthEnv() {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN);
}

async function getOAuthClient() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;
  const redirectUri = process.env.OAUTH_REDIRECT_PROD || process.env.OAUTH_REDIRECT_LOCAL || "http://localhost:3000/api/oauth2callback";
  const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, redirectUri);
  oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
  return oauth2Client;
}

async function findAlbumId(photos: any, title: string) {
  // 1) procurar na biblioteca
  let pageToken: string | undefined;
  for (let i = 0; i < 10; i++) {
    const { data } = await photos.albums.list({ pageSize: 50, pageToken });
    const found = (data.albums ?? []).find((a: any) => a.title === title);
    if (found) return { id: found.id, shared: false };
    pageToken = data.nextPageToken || undefined;
    if (!pageToken) break;
  }
  // 2) procurar em compartilhados
  pageToken = undefined;
  for (let i = 0; i < 10; i++) {
    const { data } = await photos.sharedAlbums.list({ pageSize: 50, pageToken });
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
    const albumTitle = process.env.GOOGLE_PHOTOS_ALBUM_TITLE || "";
    if (!hasOAuthEnv() || !albumTitle) {
      if (debug) return res.status(200).json({ reason: "missing_env_or_title", albumTitle, staticPhotos });
      return res.status(200).json(staticPhotos);
    }

    const oauth2Client = await getOAuthClient();
    const photos = google.photoslibrary({ version: "v1", auth: oauth2Client });

    const found = await findAlbumId(photos, albumTitle);
    if (!found) {
      if (debug) return res.status(200).json({ reason: "album_not_found", triedTitle: albumTitle, hint: "Adicione o álbum à biblioteca ou mantenha sharedAlbums ativado", staticPhotos });
      return res.status(200).json(staticPhotos);
    }

    const items: any[] = [];
    let pageToken: string | undefined;
    while (items.length < limit) {
      const { data } = await photos.mediaItems.search({
        requestBody: { albumId: found.id, pageSize: Math.min(50, limit - items.length), pageToken },
      });
      (data.mediaItems ?? []).forEach((m: any) => items.push(m));
      pageToken = data.nextPageToken || undefined;
      if (!pageToken) break;
    }

    const result = items.slice(0, limit).map((m: any) => ({
      url: `${m.baseUrl}=w1600`,
      alt: m.filename || m.description || "Foto",
      width: m.mediaMetadata?.width,
      height: m.mediaMetadata?.height,
      mimeType: m.mimeType,
    }));

    if (debug) return res.status(200).json({ ok: true, shared: found.shared, count: result.length, sample: result.slice(0, 2) });
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=300");
    return res.status(200).json(result.length ? result : staticPhotos);
  } catch (e: any) {
    if (debug) return res.status(200).json({ reason: "exception", message: e?.message, staticFallback: true });
    return res.status(200).json(staticPhotos);
  }
}
