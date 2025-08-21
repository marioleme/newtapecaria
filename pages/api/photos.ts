// pages/api/photos.ts - VERSÃO FINAL E ROBUSTA
import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

const staticPhotos = [
  { url: "/images/banner-tapecaria-jose-antonio.jpg", alt: "Reforma de sofá – antes e depois" },
];

async function getPhotosFromGoogle(req: NextApiRequest) {
   // ADICIONE ESTA LINHA PARA VERIFICAR O TOKEN EM USO
  console.log("### VERIFICANDO TOKEN USADO PELO SERVIDOR ### ->", process.env.GOOGLE_REFRESH_TOKEN);

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, GOOGLE_PHOTOS_ALBUM_TITLE } = process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN || !GOOGLE_PHOTOS_ALBUM_TITLE) {
    throw new Error("Variáveis de ambiente faltando");
  }

  // 1. Cria o cliente OAuth2 e obtém um access_token válido
  const auth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
  auth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
  const { token: accessToken } = await auth.getAccessToken();
  if (!accessToken) {
    throw new Error("Falha ao obter access token com o refresh token.");
  }

  // 2. Função auxiliar para fazer chamadas à API com o token
  async function fetchFromPhotosAPI(path: string, body?: object) {
    const url = `https://photoslibrary.googleapis.com/v1/${path}`;
    const res = await fetch(url, {
      method: body ? 'POST' : 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Erro na API do Google Fotos (${res.status}): ${errorText}`);
    }
    return res.json();
  }

  // 3. Procura pelo álbum
  let albumId = "";
  let source = "not_found";

  const albumsResponse: any = await fetchFromPhotosAPI("albums?pageSize=50");
  const foundAlbum = albumsResponse.albums?.find((a: any) => a.title === GOOGLE_PHOTOS_ALBUM_TITLE);

  if (foundAlbum) {
    albumId = foundAlbum.id;
    source = "biblioteca";
  } else {
    const sharedAlbumsResponse: any = await fetchFromPhotosAPI("sharedAlbums?pageSize=50");
    const foundSharedAlbum = sharedAlbumsResponse.sharedAlbums?.find((a: any) => a.title === GOOGLE_PHOTOS_ALBUM_TITLE);
    if (foundSharedAlbum) {
      albumId = foundSharedAlbum.id;
      source = "compartilhado";
    }
  }

  if (!albumId) {
    throw new Error(`Álbum com o título "${GOOGLE_PHOTOS_ALBUM_TITLE}" não foi encontrado.`);
  }

  // 4. Busca as fotos do álbum
  const limit = Math.max(1, Math.min(50, Number(req.query.limit ?? 12)));
  const searchResponse: any = await fetchFromPhotosAPI("mediaItems:search", { albumId, pageSize: limit });
  
  const result = (searchResponse.mediaItems || [])
    .filter((m: any) => m.mediaMetadata?.photo)
    .map((m: any) => ({
      url: `${m.baseUrl}=w1600`,
      alt: m.filename || m.description || "Foto do álbum",
    }));

  if (req.query.debug === "1") {
    return { ok: true, source, albumId, count: result.length, sample: result.slice(0, 2) };
  }

  return result;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const photos = await getPhotosFromGoogle(req);
    if (req.query.debug === "1") {
      return res.status(200).json(photos);
    }
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=300");
    return res.status(200).json(photos.length ? photos : staticPhotos);
  } catch (e: any) {
    console.error("ERRO FINAL EM /api/photos:", e.message);
    if (req.query.debug === "1") {
      return res.status(500).json({ reason: "exception", message: e.message, staticFallback: true });
    }
    return res.status(200).json(staticPhotos);
  }
}