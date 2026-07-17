import Image from "next/image";
import { getProfiles, isProfileActive } from "@/lib/profiles";
import AdSlot from "@/components/AdSlot";
import ProfileCardSlider from "@/components/ProfileCardSlider";
import ProfileCardLink from "@/components/ProfileCardLink";
import GtmViewItemList from "@/components/GtmViewItemList";
import defaultImage from "@/assets/images/default.webp";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export default async function Home() {
  const profiles = (await getProfiles()).filter(isProfileActive);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: profiles.map((profile, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/users/${profile.id}`,
      name: profile.firstName,
      image: profile.images?.length ? profile.images[0] : undefined,
    })),
  };

  return (
    <div className="flex flex-1 flex-col bg-purple-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GtmViewItemList profiles={profiles} />
      <header className="border-b border-pink-900 bg-fuchsia-950 py-4 text-center">
        <h1 className="text-xl font-bold tracking-tight text-pink-50">
          Pendik Escort
        </h1>
      </header>

      {/* WhatsApp Call to Action Banner */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-6">
        <a
          href="https://wa.me/905312392985?text=Merhaba%2C%20ilanımı%20yayınlamak%20istiyorum."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-pink-900/60 bg-purple-900/20 px-4 py-3 transition-colors hover:bg-purple-900/40"
        >
          <svg
            className="h-5 w-5 shrink-0 text-emerald-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.024-.014-.507-.25-1.156-.29-.097-.037-.167-.056-.245.056-.078.12-.302.379-.37.45-.069.07-.139.08-.23.033-.09-.047-.384-.143-.73-.447-.27-.24-.454-.537-.507-.63-.053-.09-.006-.139.038-.184.04-.04.09-.107.135-.162.045-.053.06-.09.09-.15.033-.06.017-.113-.008-.16-.024-.047-.245-.586-.336-.807-.088-.209-.18-.18-.245-.183-.062-.003-.133-.003-.205-.003-.072 0-.19.027-.29.135-.101.108-.385.377-.385.918 0 .54.393 1.062.448 1.135.056.07 7.71 11.776 17.1 11.23.813-.473 1.624-.956 1.902-1.31.28-.352.28-.656.224-.713-.056-.056-.205-.138-.472-.251zM12.004 2c-5.525 0-10 4.477-10 10 0 1.777.463 3.517 1.345 5.06L2.1 22l5.105-1.34C8.71 21.536 10.33 22 12.004 22c5.525 0 10-4.477 10-10 0-5.523-4.475-10-10-10zM12 20.354c-1.59 0-3.15-.419-4.52-1.21l-.324-.195-3.355.88.896-3.27-.215-.341c-.88-1.4-1.35-3.03-1.35-4.718 0-4.814 3.917-8.73 8.73-8.73 2.29 0 4.44.892 6.06 2.513 1.625 1.62 2.515 3.78 2.515 6.07 0 4.816-3.916 8.73-8.73 8.73z" />
          </svg>
          <p className="truncate text-sm text-pink-100">
            İlanınızı hemen yayınlamak için{" "}
            <span className="font-medium text-emerald-400">WhatsApp</span>
            {"'tan yazın"}
          </p>
        </a>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-4 px-4 py-6">
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
                className="relative flex items-stretch gap-1 overflow-hidden rounded-xl border border-pink-900 bg-purple-900/40 shadow-sm transition hover:shadow-md"
              >
                <div className="absolute left-0 top-0 z-10 h-full w-[35%] overflow-hidden">
                  <Image
                    src={defaultImage}
                    alt=""
                    fill
                    sizes="35vw"
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-4 flex flex-col gap-[10px] italic text-white">
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
                  <div className="flex h-24 flex-1 items-center justify-center bg-purple-800/40 text-sm font-semibold text-pink-200">
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
