import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const API_KEY = "4a50af45a7435412e50c30ef0d1bb1d3";
const TARGET_DIR = path.join("src", "assets", "albums");
const META_FILE = path.join(TARGET_DIR, "albums.json");

const TAGS = ["pop", "rock", "disco", "metal", "punk"];
const ALBUMS_PER_TAG = 10;

function sanitize(str) {
  return str.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, " ").trim();
}

async function ensureDir() {
  if (!fs.existsSync(TARGET_DIR)) fs.mkdirSync(TARGET_DIR, { recursive: true });
}

async function fetchAlbumsByTag(tag, limit = 50) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=${encodeURIComponent(
    tag
  )}&api_key=${API_KEY}&format=json&limit=${limit}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "MusicHubGame/1.0 (http://localhost)" }
  });

  if (!res.ok) throw new Error(`HTTP error ${res.status} for tag ${tag}`);
  const data = await res.json();
  return data.albums.album;
}

async function downloadImage(url, filename) {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(path.join(TARGET_DIR, filename), Buffer.from(buffer));
}

async function main() {
  await ensureDir();

  const metaData = [];
  const seen = new Set();
  let rank = 1;

  for (const tag of TAGS) {
    const albums = await fetchAlbumsByTag(tag, 50);
    let count = 0;

    for (const a of albums) {
      if (count >= ALBUMS_PER_TAG) break;

      const albumName = sanitize(a.name);
      const artist = sanitize(a.artist.name);
      const key = `${albumName}-${artist}`;

      if (seen.has(key)) continue;
      seen.add(key);

      const imageObj = a.image.find(i => i.size === "extralarge") || a.image[a.image.length - 1];
      if (!imageObj || !imageObj["#text"]) continue;

      const imgUrl = imageObj["#text"];
      const fileName = `${albumName}-${artist}.jpg`;

      console.log(`⬇️ #${rank} [${tag}] — ${albumName} - ${artist}`);
      await downloadImage(imgUrl, fileName);

      metaData.push({
        album: albumName,
        artist,
        tag,
        rank,
        file: fileName
      });

      rank++;
      count++;
    }
  }

  fs.writeFileSync(META_FILE, JSON.stringify(metaData, null, 2));
  console.log(`🎉 Concluído! Capas guardadas: ${metaData.length}`);
}

main().catch(console.error);
