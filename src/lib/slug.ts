// URL slug üretimi. Türkçe karakterler ASCII karşılıklarına çevrilir ki
// arama motorları için okunabilir ve kararlı URL'ler oluşsun.
export function slugify(value: string): string {
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

// Profil id'sinin ilk 8 karakteri slug'ın sonuna eklenir. Böylece aynı isimli
// iki profil çakışmaz ve slug'dan profile geri dönüş yapılabilir.
const ID_PREFIX_LENGTH = 8;

export function profileIdPrefix(id: string): string {
  return slugify(id).slice(0, ID_PREFIX_LENGTH);
}

// /escort/buse-elazig-836f343f
export function profileSlug(profile: {
  id: string;
  firstName: string;
  city: string;
}): string {
  return [slugify(profile.firstName), slugify(profile.city), profileIdPrefix(profile.id)]
    .filter(Boolean)
    .join("-");
}

export function profilePath(profile: {
  id: string;
  firstName: string;
  city: string;
}): string {
  return `/escort/${profileSlug(profile)}`;
}

// Slug'ın sonundaki id ön ekini ayıklar. İsim veya şehir değişse bile eski
// slug hâlâ doğru profile çözümlenir (canonical ile tek URL'ye toplanır).
export function idPrefixFromSlug(slug: string): string | null {
  const match = /-([a-z0-9]{1,8})$/.exec(slug);
  return match ? match[1] : null;
}
