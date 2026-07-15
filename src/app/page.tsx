import { getProfiles, isProfileActive } from "@/lib/profiles";
import AdSlot from "@/components/AdSlot";
import ProfileCardSlider from "@/components/ProfileCardSlider";
import ProfileCardLink from "@/components/ProfileCardLink";
import GtmViewItemList from "@/components/GtmViewItemList";
import defaultImage from "@/assets/images/default.webp";

export const dynamic = "force-dynamic";

export default async function Home() {
  const profiles = (await getProfiles()).filter(isProfileActive);

  return (
    <div className="flex flex-1 flex-col bg-white dark:bg-purple-950">
      <GtmViewItemList profiles={profiles} />
      <header className="border-b border-zinc-100 bg-white py-4 text-center dark:border-pink-900 dark:bg-fuchsia-950">
        <h1 className="text-xl font-bold tracking-tight text-zinc-700 dark:text-pink-50">
          Profiller
        </h1>
      </header>

      {/* WhatsApp Call to Action Banner */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-6">
        <a
          href="https://wa.me/905312392985?text=Merhaba%2C%20profilimi%20sisteme%20eklemek%20istiyorum."
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[88px] items-center justify-between gap-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-50/60 to-emerald-100/20 p-5 shadow-sm transition-all duration-300 hover:scale-[1.005] hover:border-emerald-500/30 hover:shadow-md dark:border-emerald-500/10 dark:from-emerald-950/20 dark:to-zinc-900/30"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.024-.014-.507-.25-1.156-.29-.097-.037-.167-.056-.245.056-.078.12-.302.379-.37.45-.069.07-.139.08-.23.033-.09-.047-.384-.143-.73-.447-.27-.24-.454-.537-.507-.63-.053-.09-.006-.139.038-.184.04-.04.09-.107.135-.162.045-.053.06-.09.09-.15.033-.06.017-.113-.008-.16-.024-.047-.245-.586-.336-.807-.088-.209-.18-.18-.245-.183-.062-.003-.133-.003-.205-.003-.072 0-.19.027-.29.135-.101.108-.385.377-.385.918 0 .54.393 1.062.448 1.135.056.07 7.71 11.776 17.1 11.23.813-.473 1.624-.956 1.902-1.31.28-.352.28-.656.224-.713-.056-.056-.205-.138-.472-.251zM12.004 2c-5.525 0-10 4.477-10 10 0 1.777.463 3.517 1.345 5.06L2.1 22l5.105-1.34C8.71 21.536 10.33 22 12.004 22c5.525 0 10-4.477 10-10 0-5.523-4.475-10-10-10zM12 20.354c-1.59 0-3.15-.419-4.52-1.21l-.324-.195-3.355.88.896-3.27-.215-.341c-.88-1.4-1.35-3.03-1.35-4.718 0-4.814 3.917-8.73 8.73-8.73 2.29 0 4.44.892 6.06 2.513 1.625 1.62 2.515 3.78 2.515 6.07 0 4.816-3.916 8.73-8.73 8.73z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-zinc-700 dark:text-pink-50 sm:text-base text-sm">
                Profil eklemek isteyenler yazsın
              </p>
              <p className="text-xs text-zinc-400 dark:text-pink-300 sm:text-sm">
                Siz de listeye katılmak için hemen bizimle WhatsApp üzerinden
                iletişime geçin.
              </p>
            </div>
          </div>
          <div className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500 sm:text-sm">
            Katıl
          </div>
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
                className="relative flex items-stretch gap-1 overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-sm transition hover:shadow-md dark:border-pink-900 dark:bg-purple-900/40"
              >
                <div className="absolute left-0 top-0 z-10 h-full w-[35%] overflow-hidden">
                  <img
                    src={defaultImage.src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 left-4 flex flex-col gap-[10px] italic text-white">
                    <p className="text-[15px] font-medium leading-tight">
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
                    </p>
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
                    alt={`${profile.firstName} ${profile.lastName}`}
                  />
                ) : (
                  <div className="flex h-24 flex-1 items-center justify-center bg-zinc-50 text-sm font-semibold text-zinc-500 dark:bg-purple-800/40 dark:text-pink-200">
                    {profile.firstName[0]}
                    {profile.lastName[0]}
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
