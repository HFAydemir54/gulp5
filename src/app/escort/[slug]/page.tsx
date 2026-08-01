import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getProfileByIdPrefix,
  isProfileActive,
  type Profile,
} from "@/lib/profiles";
import { idPrefixFromSlug, profilePath, profileSlug } from "@/lib/slug";
import { toWhatsappUrl } from "@/lib/phone";
import AdSlot from "@/components/AdSlot";
import ImageSlider from "@/components/ImageSlider";
import GtmViewItem from "@/components/GtmViewItem";
import ContactButtons from "@/components/ContactButtons";
import BackToListLink from "@/components/BackToListLink";
import ShareButton from "@/components/ShareButton";
import { SITE_CITY, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const siteUrl = SITE_URL;

async function resolveProfile(slug: string): Promise<Profile | null> {
  const prefix = idPrefixFromSlug(slug);
  if (!prefix) return null;
  return getProfileByIdPrefix(prefix);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await resolveProfile(slug);

  if (!profile) {
    return {
      title: "Escort bulunamadı",
      description:
        "Aradığınız escort ilanı bulunamadı veya kaldırılmış olabilir.",
      robots: { index: false, follow: false },
    };
  }

  const fallbackAbout = `${profile.firstName}, ${profile.city || SITE_CITY} bölgesinde ${profile.meetingPlace || "görüşme"} için listede yer alıyor.`;
  const about = profile.about || fallbackAbout;
  const description = profile.about
    ? `${profile.about} ${profile.city ? `${profile.city} bölgesinde` : ""} escort ${profile.firstName}, ${profile.age ? `${profile.age} yaşında, ` : ""}iletişim bilgileri sitede.`.trim()
    : `${fallbackAbout} İletişim bilgileri ve detaylar sitede.`;
  const pageUrl = `${siteUrl}${profilePath(profile)}`;
  const keywords = [
    profile.firstName,
    `${SITE_CITY} escort`,
    `${SITE_CITY} escort ${profile.firstName}`,
    profile.city,
    profile.meetingPlace,
  ].filter(Boolean) as string[];
  const title = [
    SITE_NAME,
    profile.firstName,
    profile.city,
    profile.meetingPlace,
    profile.age,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: pageUrl,
    },
    // Süresi dolmuş ilanlar sayfada kalır ama arama sonuçlarına girmez.
    robots: isProfileActive(profile)
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title,
      description: about,
      url: pageUrl,
      type: "profile",
      images: profile.images?.length ? [{ url: profile.images[0] }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: about,
      images: profile.images?.length ? [profile.images[0]] : undefined,
    },
  };
}

export default async function EscortDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await resolveProfile(slug);

  if (!profile) {
    notFound();
  }

  // İsim veya şehir düzenlenirse eski slug hâlâ çözümlenir; tek bir kanonik
  // URL kalması için güncel slug'a kalıcı olarak yönlendiriyoruz.
  const canonicalSlug = profileSlug(profile);
  if (slug !== canonicalSlug) {
    permanentRedirect(`/escort/${canonicalSlug}`);
  }

  const pageUrl = `${siteUrl}${profilePath(profile)}`;
  const whatsappUrl = toWhatsappUrl(
    profile.phone,
    `Merhaba ${profile.firstName}, ${pageUrl} sayfası üzerinden ulaşım sağlıyorum.`,
  );

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.firstName,
    description:
      profile.about ||
      `${profile.firstName} kullanıcısının profil detayları ve iletişim bilgileri.`,
    address: profile.city
      ? { "@type": "PostalAddress", addressLocality: profile.city }
      : undefined,
    image: profile.images?.length ? profile.images : undefined,
    telephone: profile.phone || undefined,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: SITE_NAME,
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${profile.firstName} - ${profile.city || SITE_CITY}`,
        item: pageUrl,
      },
    ],
  };

  return (
    <div className="flex flex-1 flex-col bg-[var(--site-bg)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <GtmViewItem profile={profile} />
      <header className="border-b border-[var(--site-border)] bg-[var(--site-header-bg)] py-4 text-center">
        <h1 className="text-xl font-bold tracking-tight text-[var(--site-accent-strong)]">
          Escort {profile.firstName} - {profile.city}
        </h1>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-4 px-4 py-6">
        <AdSlot
          slotId="1111111111"
          label="Sol Reklam Alanı"
          className="hidden w-40 shrink-0 lg:block lg:h-[600px] lg:sticky lg:top-6"
        />

        <main className="mx-auto min-w-0 w-full max-w-2xl flex-1">
          <nav aria-label="Site haritası" className="text-xs text-[var(--site-muted)]">
            <Link href="/" className="hover:text-[var(--site-accent-strong)]">
              {SITE_NAME}
            </Link>
            <span className="mx-1">/</span>
            <span className="text-[var(--site-text)]">{profile.firstName}</span>
          </nav>

          <div className="mt-2 flex items-center justify-between">
            <BackToListLink className="text-sm text-[var(--site-muted)] hover:text-[var(--site-accent-strong)]" />
            <ShareButton
              title={`Escort ${profile.firstName} - ${profile.city}`}
              url={pageUrl}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--site-muted)] transition-colors hover:bg-[var(--site-card-bg)] hover:text-[var(--site-accent-strong)]"
            />
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--site-border)] bg-[var(--site-card-bg)] shadow-sm">
            {profile.images && profile.images.length > 0 && (
              <ImageSlider images={profile.images} />
            )}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-[var(--site-border)] bg-[var(--site-card-bg)] p-3">
                  <p className="text-xs text-[var(--site-muted)]">İsim</p>
                  <p className="text-sm font-medium text-[var(--site-text)]">
                    {profile.firstName}
                  </p>
                </div>
                <div className="rounded-lg border border-[var(--site-border)] bg-[var(--site-card-bg)] p-3">
                  <p className="text-xs text-[var(--site-muted)]">Yaş</p>
                  <p className="text-sm font-medium text-[var(--site-text)]">
                    {profile.age}
                  </p>
                </div>
                <div className="rounded-lg border border-[var(--site-border)] bg-[var(--site-card-bg)] p-3">
                  <p className="text-xs text-[var(--site-muted)]">Şehir</p>
                  <p className="text-sm font-medium text-[var(--site-text)]">
                    {profile.city || "—"}
                  </p>
                </div>
                <div className="rounded-lg border border-[var(--site-border)] bg-[var(--site-card-bg)] p-3">
                  <p className="text-xs text-[var(--site-muted)]">
                    Buluşma Yeri
                  </p>
                  <p className="text-sm font-medium text-[var(--site-text)]">
                    {profile.meetingPlace || "—"}
                  </p>
                </div>
              </div>

              <ContactButtons profile={profile} whatsappUrl={whatsappUrl} />

              <div className="mt-6 border-t border-[var(--site-border)] pt-6">
                <h2 className="text-sm font-semibold text-[var(--site-text)]">
                  Hakkında
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--site-muted)]">
                  {profile.about ||
                    `${profile.firstName}, ${profile.city || "belirtilmemiş şehir"} bölgesinde ${profile.meetingPlace || "belirtilmemiş bir buluşma noktasında"} görüşmeler için listede yer alıyor.`}
                </p>
              </div>
            </div>
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
