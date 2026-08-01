import Link from "next/link";
import { getProfiles, isProfileActive, type Profile } from "@/lib/profiles";
import ProfileGrid from "@/components/ProfileGrid";
import GtmViewItemList from "@/components/GtmViewItemList";
import CategoryNav from "@/components/CategoryNav";
import SearchOverlay from "@/components/SearchOverlay";
import { CATEGORIES, applyCategory, categoryPath } from "@/lib/categories";
import { profilePath } from "@/lib/slug";
import { SITE_CITY, SITE_NAME, SITE_URL, SITE_WHATSAPP } from "@/lib/site";

export const dynamic = "force-dynamic";

const siteUrl = SITE_URL;

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default async function Home() {
  const active = (await getProfiles()).filter(isProfileActive);
  const profiles = shuffle(active);

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
      <header className="relative border-b border-[var(--site-border)] bg-[var(--site-header-bg)] py-4 text-center">
        {/* Emojiler h1'in dışında: başlık etiketi yalnızca hedef anahtar
            kelimeyi içersin, süsleme arama motoruna gürültü olarak gitmesin. */}
        <div
          className="font-bold italic tracking-tight text-[var(--site-accent-strong)]"
          style={{ fontSize: "26px" }}
        >
          <span aria-hidden="true">🔥❤️‍🔥 </span>
          <h1 className="inline">{SITE_NAME}</h1>
          <span aria-hidden="true"> 🔥❤️‍🔥</span>
        </div>
        <SearchOverlay profiles={active} />
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
                      {category.name}
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
        </main>
      </div>
    </div>
  );
}
