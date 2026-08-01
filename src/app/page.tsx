import Link from "next/link";
import { getProfiles, isProfileActive, type Profile } from "@/lib/profiles";
import AdSlot from "@/components/AdSlot";
import ProfileGrid from "@/components/ProfileGrid";
import GtmViewItemList from "@/components/GtmViewItemList";
import CategoryNav from "@/components/CategoryNav";
import { CATEGORIES, applyCategory, categoryPath } from "@/lib/categories";
import { profilePath } from "@/lib/slug";
import { SITE_CITY, SITE_NAME, SITE_URL, SITE_WHATSAPP } from "@/lib/site";

export const dynamic = "force-dynamic";

const siteUrl = SITE_URL;

// Her istekte rastgele sıralama, arama motoruna her taramada farklı bir sayfa
// gösterir ve sıralama sinyallerini zayıflatır. Bunun yerine güne göre sabit
// bir tohumla karıştırıyoruz: gün içinde sıra sabit, her gün ilanlar döner.
function dailySeed(): number {
  const now = new Date();
  return (
    now.getUTCFullYear() * 10000 + (now.getUTCMonth() + 1) * 100 + now.getUTCDate()
  );
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const result = [...items];
  let state = seed || 1;
  const next = () => {
    // Mulberry32 — küçük ve deterministik bir PRNG.
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default async function Home() {
  const active = (await getProfiles()).filter(isProfileActive);
  const profiles = seededShuffle(active, dailySeed());

  // Kategori linklerinin yanında ilan sayısını göstermek hem kullanıcıya
  // bilgi verir hem de iç linklere bağlam kazandırır.
  const categoryCounts = CATEGORIES.map((category) => ({
    category,
    count: applyCategory(category, active).length,
  })).filter(({ count }) => count > 0);

  const heroSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${SITE_NAME} - Güncel Escort İlanları`,
    description: `${SITE_CITY} escort ve çevresindeki en güncel escort ilanları. Güvenilir ve kaliteli hizmet arayanlar için özel profiller.`,
    url: siteUrl,
    mainEntity: {
      "@type": "ItemList",
      name: `${SITE_NAME} İlanları`,
      description: `${SITE_CITY} ve çevresindeki aktif escort ilanları`,
      numberOfItems: profiles.length,
      itemListElement: profiles.map((profile: Profile, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}${profilePath(profile)}`,
        item: {
          "@type": "Person",
          name: profile.firstName,
          description:
            profile.about ||
            `${SITE_CITY} escort ${profile.firstName}, ${profile.city || SITE_CITY} bölgesinde ${profile.meetingPlace || "görüşme"} için listede yer alıyor.`,
          age: profile.age,
          image: profile.images?.length ? profile.images[0] : undefined,
          memberOf: {
            "@type": "Organization",
            name: SITE_NAME,
            url: siteUrl,
          },
        },
      })),
    },
  };

  return (
    <div className="flex flex-1 flex-col bg-[var(--site-bg)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(heroSchema) }}
      />
      <GtmViewItemList profiles={profiles} />
      <header className="border-b border-[var(--site-border)] bg-[var(--site-header-bg)] py-4 text-center">
        <h1
          className="font-bold italic tracking-tight text-[var(--site-accent-strong)]"
          style={{ fontSize: "26px" }}
        >
          🔥❤️‍🔥 {SITE_NAME} 🔥❤️‍🔥
        </h1>
      </header>

      {/* WhatsApp Call to Action Banner */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-3">
        <a
          href={`https://wa.me/${SITE_WHATSAPP}?text=Merhaba%2C%20ilanımı%20yayınlamak%20istiyorum.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-[var(--site-banner-border)] bg-[var(--site-banner-bg)] px-4 py-3 transition-colors hover:bg-[var(--site-banner-bg-hover)]"
        >
          <p
            className="truncate text-[var(--site-accent-strong)]"
            style={{
              fontSize: "18px",
              textAlign: "center",
              width: "100%",
              fontWeight: "bold",
            }}
          >
            👑 Vitrin İlanı Vermek İçin Tıklayınız 👑
          </p>
        </a>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-4 px-2 py-6">
        <AdSlot
          slotId="1111111111"
          label="Sol Reklam Alanı"
          className="hidden w-40 shrink-0 lg:block lg:h-[600px] lg:sticky lg:top-6"
        />

        <main className="min-w-0 flex-1">
          <CategoryNav className="mb-4" />

          <ProfileGrid profiles={profiles} listName="Escort Listesi" />

          {categoryCounts.length > 0 && (
            <section className="mt-8 rounded-xl border border-[var(--site-border)] bg-[var(--site-card-bg)] p-4">
              <h2 className="text-base font-semibold text-[var(--site-text)]">
                {SITE_CITY} escort kategorileri
              </h2>
              <ul className="mt-3 space-y-2">
                {categoryCounts.map(({ category, count }) => (
                  <li key={category.slug} className="text-sm">
                    <Link
                      href={categoryPath(category)}
                      className="font-medium text-[var(--site-accent-strong)] underline"
                    >
                      {category.h1}
                    </Link>
                    <span className="text-[var(--site-muted)]">
                      {" "}
                      — {count} aktif ilan. {category.description}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <AdSlot
            slotId="3333333333"
            label="Alt Reklam Alanı"
            className="mt-8 h-24 w-full"
          />
        </main>

        <AdSlot
          slotId="2222222222"
          label="Sağ Reklam Alanı"
          className="hidden w-40 shrink-0 lg:block lg:h-[600px] lg:sticky lg:top-6"
        />
      </div>
    </div>
  );
}
