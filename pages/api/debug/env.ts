import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: !!process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_PHOTOS_ALBUM_TITLE: !!process.env.GOOGLE_PHOTOS_ALBUM_TITLE,
    OAUTH_REDIRECT_PROD: !!process.env.OAUTH_REDIRECT_PROD,
    OAUTH_REDIRECT_LOCAL: process.env.OAUTH_REDIRECT_LOCAL ?? "(default) http://localhost:3000/api/oauth2callback",
  });
}
