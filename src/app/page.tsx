import Image from "next/image";
import { getProfiles, isProfileActive } from "@/lib/profiles";
import AdSlot from "@/components/AdSlot";
import ProfileCardSlider from "@/components/ProfileCardSlider";
import ProfileCardLink from "@/components/ProfileCardLink";
import GtmViewItemList from "@/components/GtmViewItemList";
import defaultImage from "@/assets/images/default.webp";
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
  const profiles = shuffle((await getProfiles()).filter(isProfileActive));

  const heroSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${SITE_NAME} - Güncel Escort İlanları`,
    description:
      `${SITE_CITY} escort ve çevresindeki en güncel escort ilanları. Güvenilir ve kaliteli hizmet arayanlar için özel profiller.`,
    url: siteUrl,
    mainEntity: {
      "@type": "ItemList",
      name: `${SITE_NAME} İlanları`,
      description: `${SITE_CITY} ve çevresindeki aktif escort ilanları`,
      itemListElement: profiles.map((profile, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/users/${profile.id}`,
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
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {profiles.map((profile) => (
              <ProfileCardLink
                key={profile.id}
                profile={profile}
                className="relative flex items-stretch gap-1 overflow-hidden rounded-xl border border-[var(--site-border)] bg-[var(--site-card-bg)] shadow-sm transition hover:shadow-md"
              >
                <div className="absolute left-0 top-0 z-10 h-full w-[35%] overflow-hidden">
                  <Image
                    src={defaultImage}
                    alt=""
                    fill
                    sizes="35vw"
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-4 italic text-white">
                    <h3 className="text-[15px] font-medium leading-tight">
                      <span style={{ textShadow: "none" }}>👸</span>
                      &nbsp;
                      <span
                        style={{
                          textShadow:
                            "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                        }}
                      >
                        {profile.firstName}
                      </span>
                    </h3>
                    {profile.city && (
                      <p className="text-[13px] leading-tight">
                        <span style={{ textShadow: "none" }}>📍</span>
                        &nbsp;
                        <span
                          style={{
                            textShadow:
                              "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                          }}
                        >
                          {profile.city}
                        </span>
                      </p>
                    )}
                    {profile.meetingPlace && (
                      <p className="text-[13px] leading-tight">
                        <span style={{ textShadow: "none" }}>🛏️</span>
                        &nbsp;
                        <span
                          style={{
                            textShadow:
                              "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                          }}
                        >
                          {profile.meetingPlace}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                {profile.images && profile.images.length > 0 ? (
                  <ProfileCardSlider
                    images={profile.images}
                    alt={profile.firstName}
                  />
                ) : (
                  <div className="flex h-[124px] flex-1 items-center justify-center bg-[var(--site-card-bg)] text-sm font-semibold text-[var(--site-muted)]">
                    {profile.firstName[0]}
                  </div>
                )}
              </ProfileCardLink>
            ))}
          </div>

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
