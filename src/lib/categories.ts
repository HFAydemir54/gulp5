import type { Profile } from "@/lib/profiles";
import { SITE_CITY, SITE_CITY_SLUG } from "@/lib/site";

export type Category = {
  // URL'de görünen tam slug: "elazig-travesti-escort"
  slug: string;
  h1: string;
  title: string;
  description: string;
  // Sayfanın kendine özgü tanıtım metni (thin content olmaması için).
  intro: string[];
  filter: (profile: Profile) => boolean;
  // Listeyi anasayfadan farklı sıralamak için. Belirtilmezse varsayılan sıra.
  sort?: (a: Profile, b: Profile) => number;
};

const TRANS_PATTERN = /travesti|trans\b/i;

function isTrans(profile: Profile): boolean {
  return TRANS_PATTERN.test(`${profile.about} ${profile.firstName}`);
}

const newestFirst = (a: Profile, b: Profile) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

// Kategoriler şehir adına göre üretilir; SITE_CITY değişince tüm slug'lar,
// başlıklar ve metinler otomatik olarak yeni şehre uyarlanır.
export const CATEGORIES: Category[] = [
  {
    slug: `${SITE_CITY_SLUG}-eskort`,
    h1: `${SITE_CITY} Eskort İlanları`,
    title: `${SITE_CITY} Eskort | En Yeni Eskort İlanları`,
    description: `${SITE_CITY} eskort ilanları en yeniden eskiye doğru sıralandı. Güncel eskort profillerini yayın tarihine göre inceleyin.`,
    intro: [
      `${SITE_CITY} eskort ilanlarını yayınlanma tarihine göre sıraladık. Bu sayfada en son eklenen profiller en üstte yer alır; böylece siteye yeni katılan ilanları tek tek aramak zorunda kalmazsınız.`,
      `Türkçe'de aynı kelime için "escort" ve "eskort" yazımlarının ikisi de yaygın kullanılır. Hangi yazımla ararsanız arayın, ${SITE_CITY} genelindeki aynı güncel ilan havuzuna ulaşırsınız. Listedeki her profilde yaş, görüşme yeri ve iletişim bilgileri profil sayfasında yer alır.`,
      `Süresi dolan ilanlar listeden otomatik olarak düşer, dolayısıyla burada gördüğünüz her profil yayında olan aktif bir ilandır.`,
    ],
    filter: () => true,
    sort: newestFirst,
  },
  {
    slug: `${SITE_CITY_SLUG}-travesti-escort`,
    h1: `${SITE_CITY} Travesti Escort İlanları`,
    title: `${SITE_CITY} Travesti Escort | Trans Escort İlanları`,
    description: `${SITE_CITY} travesti escort ilanları ve trans escort profilleri. Aktif ilanları fotoğraf ve iletişim bilgileriyle inceleyin.`,
    intro: [
      `${SITE_CITY} travesti escort ilanları bu sayfada ayrı olarak listelenir. Genel listede yüzlerce profil arasında arama yapmak yerine, doğrudan bu kategoriden aradığınız ilanlara ulaşabilirsiniz.`,
      `Kategoriye giren profiller ilan metinlerindeki tanımlara göre belirlenir. Trans ve travesti arayan ziyaretçilerin ikisi de bu sayfaya yönlendirilir. Her ilanın fotoğrafları, yaşı ve görüşme yeri profil sayfasında ayrıntılı olarak yer alır.`,
    ],
    filter: isTrans,
    sort: newestFirst,
  },
  {
    slug: `${SITE_CITY_SLUG}-olgun-escort`,
    h1: `${SITE_CITY} Olgun Escort İlanları`,
    title: `${SITE_CITY} Olgun Escort | 30 Yaş Üstü Escort İlanları`,
    description: `${SITE_CITY} olgun escort ilanları. 30 yaş ve üzeri escort profillerini fotoğraf ve iletişim bilgileriyle görüntüleyin.`,
    intro: [
      `Bu sayfada ${SITE_CITY} genelindeki 30 yaş ve üzeri escort ilanları toplanır. Olgun escort araması yapan ziyaretçiler için genel listeyi yaşa göre filtrelenmiş hâlde sunuyoruz.`,
      `Listedeki profiller ilanlarında belirtilen yaş bilgisine göre otomatik olarak seçilir; yeni bir ilan eklendiğinde yaş aralığına uyuyorsa bu sayfada da anında görünür. Profil sayfalarında görüşme yeri ve iletişim bilgilerine ulaşabilirsiniz.`,
    ],
    filter: (profile) => profile.age >= 30,
  },
  {
    slug: `${SITE_CITY_SLUG}-genc-escort`,
    h1: `${SITE_CITY} Genç Escort İlanları`,
    title: `${SITE_CITY} Genç Escort | Genç Escort İlanları ve Profilleri`,
    description: `${SITE_CITY} genç escort ilanları. 29 yaş altı escort profillerini fotoğraf ve iletişim bilgileriyle görüntüleyin.`,
    intro: [
      `${SITE_CITY} genç escort ilanları bu sayfada 29 yaş altı profillerle sınırlandırılmış olarak listelenir. Yaş aralığına göre arama yapan ziyaretçiler için hazırlanmış bir kategoridir.`,
      `Filtre, ilan sahiplerinin profillerinde belirttiği yaş bilgisine dayanır. Kategoriye giren her profilin fotoğrafları, görüşme yeri ve iletişim bilgileri kendi profil sayfasında yer alır.`,
    ],
    filter: (profile) => profile.age < 30,
  },
];

export function getCategoryBySlug(slug: string): Category | null {
  return CATEGORIES.find((category) => category.slug === slug) ?? null;
}

export function categoryPath(category: Category): string {
  return `/${category.slug}`;
}

export function applyCategory(
  category: Category,
  profiles: Profile[]
): Profile[] {
  const filtered = profiles.filter(category.filter);
  return category.sort ? [...filtered].sort(category.sort) : filtered;
}

// Boş veya neredeyse boş kategoriler Google için "thin content" sayılır.
// Bu eşiğin altındaki sayfalar yayında kalır ama indekslenmez.
export const MIN_INDEXABLE_PROFILES = 3;
