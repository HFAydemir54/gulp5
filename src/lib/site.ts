function capitalize(value: string): string {
  return value.charAt(0).toLocaleUpperCase("tr-TR") + value.slice(1);
}

// Env dosyalarında Türkçe karakter yazmak istemeyenler için ASCII slug -> gerçek
// Türkçe isim eşleşmesi. Listede olmayan bir değer girilirse olduğu gibi kullanılır.
const CITY_DISPLAY_NAMES: Record<string, string> = {
  elazig: "Elazığ",
  pendik: "Pendik",
  istanbul: "İstanbul",
  izmir: "İzmir",
  kadikoy: "Kadıköy",
  besiktas: "Beşiktaş",
  bakirkoy: "Bakırköy",
  atasehir: "Ataşehir",
  maltepe: "Maltepe",
  umraniye: "Ümraniye",
  kartal: "Kartal",
  sisli: "Şişli",
};

const rawSiteCity = (process.env.NEXT_PUBLIC_SITE_CITY || "Pendik")
  .toLocaleLowerCase("tr-TR")
  .trim();

// Env değeri hangi harf durumuyla/Türkçe karaktersiz girilirse girilsin
// (pendik, ELAZIG, elazig...) başlıkta doğru Türkçe isim gösterilir.
export const SITE_CITY =
  CITY_DISPLAY_NAMES[rawSiteCity] || capitalize(rawSiteCity);
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.pendikescortt.com";
export const SITE_WHATSAPP =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905312392985";
export const SITE_NAME = `${SITE_CITY} Escort`;

function slugify(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Her domain'in kendi profil verisini kullanması için ayırt edici anahtar
// (data/profiles.<key>.json dosya adında ve KV key'inde kullanılır)
export const SITE_KEY =
  process.env.NEXT_PUBLIC_SITE_KEY || slugify(SITE_CITY) || "default";
