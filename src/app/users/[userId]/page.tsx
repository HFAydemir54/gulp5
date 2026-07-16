import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfileById } from "@/lib/profiles";
import { toWhatsappUrl } from "@/lib/phone";
import AdSlot from "@/components/AdSlot";
import ImageSlider from "@/components/ImageSlider";
import GtmViewItem from "@/components/GtmViewItem";
import ContactButtons from "@/components/ContactButtons";
import BackToListLink from "@/components/BackToListLink";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> {
  const { userId } = await params;
  const profile = await getProfileById(userId);

  if (!profile) {
    return { title: "Escort bulunamadı" };
  }

  const fallbackAbout = `${profile.firstName}, ${profile.city || "Pendik"} bölgesinde ${profile.meetingPlace || "görüşme"} için listede yer alıyor.`;
  const about = profile.about || fallbackAbout;
  const description = profile.about
    ? `${profile.about} ${profile.city ? `${profile.city} bölgesinde` : ""} escort ${profile.firstName}, ${profile.age ? `${profile.age} yaşında, ` : ""}iletişim bilgileri sitede.`.trim()
    : `${fallbackAbout} İletişim bilgileri ve detaylar sitede.`;
  const pageUrl = `${siteUrl}/users/${profile.id}`;
  const keywords = [
    profile.firstName,
    "Pendik escort",
    profile.city,
    profile.meetingPlace,
  ].filter(Boolean) as string[];

  return {
    title: `${profile.firstName} | Escort`,
    description,
    keywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${profile.firstName} | Escort`,
      description: about,
      url: pageUrl,
      type: "profile",
      images: profile.images?.length ? [{ url: profile.images[0] }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.firstName} | Escort`,
      description: about,
      images: profile.images?.length ? [profile.images[0]] : undefined,
    },
  };
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const profile = await getProfileById(userId);

  if (!profile) {
    notFound();
  }

  const whatsappUrl = toWhatsappUrl(
    profile.phone,
    `Merhaba ${profile.firstName}, https://www.pendikescortt.com/ sitesi üzerinden ulaşım sağlıyorum.`,
  );

  const jsonLd = {
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
    url: `${siteUrl}/users/${profile.id}`,
    mainEntityOfPage: `${siteUrl}/users/${profile.id}`,
  };

  return (
    <div className="flex flex-1 flex-col bg-purple-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GtmViewItem profile={profile} />
      <header className="border-b border-pink-900 bg-fuchsia-950 py-4 text-center">
        <h1 className="text-xl font-bold tracking-tight text-pink-50">
          Escort {profile.firstName}
        </h1>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-4 px-4 py-6">
        <AdSlot
          slotId="1111111111"
          label="Sol Reklam Alanı"
          className="hidden w-40 shrink-0 lg:block lg:h-[600px] lg:sticky lg:top-6"
        />

        <main className="mx-auto min-w-0 w-full max-w-2xl flex-1">
          <BackToListLink className="text-sm text-pink-300 hover:text-pink-100" />

          <div className="mt-4 overflow-hidden rounded-xl border border-pink-900 bg-purple-900/40 shadow-sm">
            {profile.images && profile.images.length > 0 && (
              <ImageSlider images={profile.images} />
            )}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-pink-900 bg-purple-800/40 p-3">
                  <p className="text-xs text-pink-300">İsim</p>
                  <p className="text-sm font-medium text-pink-50">
                    {profile.firstName}
                  </p>
                </div>
                <div className="rounded-lg border border-pink-900 bg-purple-800/40 p-3">
                  <p className="text-xs text-pink-300">Yaş</p>
                  <p className="text-sm font-medium text-pink-50">
                    {profile.age}
                  </p>
                </div>
                <div className="rounded-lg border border-pink-900 bg-purple-800/40 p-3">
                  <p className="text-xs text-pink-300">Şehir</p>
                  <p className="text-sm font-medium text-pink-50">
                    {profile.city || "—"}
                  </p>
                </div>
                <div className="rounded-lg border border-pink-900 bg-purple-800/40 p-3">
                  <p className="text-xs text-pink-300">Buluşma Yeri</p>
                  <p className="text-sm font-medium text-pink-50">
                    {profile.meetingPlace || "—"}
                  </p>
                </div>
              </div>

              <ContactButtons profile={profile} whatsappUrl={whatsappUrl} />

              <div className="mt-6 border-t border-pink-900 pt-6">
                <h2 className="text-sm font-semibold text-pink-50">Hakkında</h2>
                <p className="mt-2 text-sm leading-relaxed text-pink-300">
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
