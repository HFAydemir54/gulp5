// data/profiles.*.json dosyalarında artık atıf yapılmayan Cloudinary
// görsellerini bulur ve isteğe bağlı olarak siler.
//
//   node scripts/prune-images.mjs            -> yalnızca rapor (hiçbir şey silinmez)
//   node scripts/prune-images.mjs --delete   -> öksüz görselleri gerçekten siler
//
// Silme geri alınamaz, bu yüzden varsayılan davranış kuru çalıştırmadır.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { v2 as cloudinary } from "cloudinary";

const ROOT = path.resolve(import.meta.dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const FOLDER = "profiles";

// .env.local dosyasındaki değerleri ortama aktar (zaten tanımlıysa dokunma).
try {
  const raw = await readFile(path.join(ROOT, ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  }
} catch {
  // .env.local yoksa ortam değişkenlerine güveniriz.
}

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error("CLOUDINARY_* değişkenleri tanımlı değil.");
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// URL'den public_id çıkarır:
// https://res.cloudinary.com/<cloud>/image/upload/<donusumler>/v123/profiles/elazig/abc.jpg
// -> profiles/elazig/abc
function publicIdFromUrl(url) {
  const marker = "/image/upload/";
  const index = url.indexOf(marker);
  if (index === -1) return null;

  let rest = url.slice(index + marker.length);
  // Sürüm öneki ve varsa dönüşüm segmentlerini at.
  const parts = rest.split("/");
  while (parts.length && !parts[0].startsWith(FOLDER)) parts.shift();
  if (!parts.length) return null;

  rest = parts.join("/");
  return rest.replace(/\.[a-z0-9]+$/i, "");
}

// Tüm site veri dosyalarındaki görselleri topla. Bir görselin başka bir
// domainin verisinde kullanılıyor olabileceğini gözden kaçırmamak için
// dosyaların hepsi birlikte okunur.
const files = (await readdir(DATA_DIR)).filter(
  (name) => name.startsWith("profiles.") && name.endsWith(".json")
);

const referenced = new Set();
for (const name of files) {
  const profiles = JSON.parse(await readFile(path.join(DATA_DIR, name), "utf8"));
  for (const profile of profiles) {
    for (const url of profile.images ?? []) {
      const id = publicIdFromUrl(url);
      if (id) referenced.add(id);
    }
  }
}

// Cloudinary'deki tüm görselleri sayfalayarak listele.
const stored = [];
let cursor;
do {
  const page = await cloudinary.api.resources({
    type: "upload",
    prefix: `${FOLDER}/`,
    max_results: 500,
    next_cursor: cursor,
  });
  stored.push(...page.resources);
  cursor = page.next_cursor;
} while (cursor);

const orphans = stored.filter((res) => !referenced.has(res.public_id));
const missing = [...referenced].filter(
  (id) => !stored.some((res) => res.public_id === id)
);
const orphanBytes = orphans.reduce((sum, res) => sum + (res.bytes ?? 0), 0);

console.log(`veri dosyası      : ${files.join(", ")}`);
console.log(`JSON'da atıf yapılan: ${referenced.size}`);
console.log(`Cloudinary'de duran : ${stored.length}`);
console.log(`öksüz (silinebilir) : ${orphans.length}  (~${(orphanBytes / 1024 / 1024).toFixed(1)} MB)`);
if (missing.length) {
  console.log(`\nUYARI: JSON'da geçen ama Cloudinary'de bulunmayan ${missing.length} görsel var:`);
  missing.slice(0, 10).forEach((id) => console.log(`  ${id}`));
}

if (!orphans.length) {
  console.log("\nTemizlenecek bir şey yok.");
  process.exit(0);
}

console.log("\nöksüz görseller:");
orphans.slice(0, 30).forEach((res) => console.log(`  ${res.public_id}`));
if (orphans.length > 30) console.log(`  ... ve ${orphans.length - 30} tane daha`);

if (!process.argv.includes("--delete")) {
  console.log("\nKuru çalıştırma — hiçbir şey silinmedi.");
  console.log("Gerçekten silmek için: node scripts/prune-images.mjs --delete");
  process.exit(0);
}

// Cloudinary tek çağrıda en fazla 100 kayıt siliyor.
let deleted = 0;
for (let i = 0; i < orphans.length; i += 100) {
  const batch = orphans.slice(i, i + 100).map((res) => res.public_id);
  const result = await cloudinary.api.delete_resources(batch);
  deleted += Object.values(result.deleted ?? {}).filter(
    (state) => state === "deleted"
  ).length;
  console.log(`  silindi: ${deleted}/${orphans.length}`);
}
console.log(`\nToplam ${deleted} görsel silindi.`);
