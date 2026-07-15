import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfileById } from "@/lib/profiles";
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
    return { title: "Profil bulunamadı" };
  }

  const description =
    profile.about ||
    `${profile.firstName} kullanıcısının profil detayları ve iletişim bilgileri.`;
  const pageUrl = `${siteUrl}/users/${profile.id}`;

  return {
    title: `${profile.firstName} | Profil`,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${profile.firstName} | Profil`,
      description,
      url: pageUrl,
      type: "profile",
      images: profile.images?.length ? [{ url: profile.images[0] }] : undefined,
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

  const whatsappNumber = `90${profile.phone.replace(/[^\d]/g, "").replace(/^0/, "")}`;
  const whatsappMessage = encodeURIComponent(
    `Merhaba ${profile.firstName}, size ulaşmak istiyorum.`,
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
    image: profile.images?.[0],
    url: `${siteUrl}/users/${profile.id}`,
  };

  return (
    <div className="flex flex-1 flex-col bg-white dark:bg-purple-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GtmViewItem profile={profile} />
      <header className="border-b border-zinc-100 bg-white py-4 text-center dark:border-pink-900 dark:bg-fuchsia-950">
        <h1 className="text-xl font-bold tracking-tight text-zinc-700 dark:text-pink-50">
          {profile.firstName}
        </h1>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-4 px-4 py-6">
        <AdSlot
          slotId="1111111111"
          label="Sol Reklam Alanı"
          className="hidden w-40 shrink-0 lg:block lg:h-[600px] lg:sticky lg:top-6"
        />

        <main className="mx-auto min-w-0 w-full max-w-2xl flex-1">
          <BackToListLink className="text-sm text-zinc-400 hover:text-zinc-600 dark:text-pink-300 dark:hover:text-pink-100" />

          <div className="mt-4 overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-pink-900 dark:bg-purple-900/40">
            {profile.images && profile.images.length > 0 && (
              <ImageSlider images={profile.images} />
            )}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 dark:border-pink-900 dark:bg-purple-800/40">
                  <p className="text-xs text-zinc-400 dark:text-pink-300">İsim</p>
                  <p className="text-sm font-medium text-zinc-700 dark:text-pink-50">
                    {profile.firstName}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 dark:border-pink-900 dark:bg-purple-800/40">
                  <p className="text-xs text-zinc-400 dark:text-pink-300">Yaş</p>
                  <p className="text-sm font-medium text-zinc-700 dark:text-pink-50">
                    {profile.age}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 dark:border-pink-900 dark:bg-purple-800/40">
                  <p className="text-xs text-zinc-400 dark:text-pink-300">Şehir</p>
                  <p className="text-sm font-medium text-zinc-700 dark:text-pink-50">
                    {profile.city || "—"}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 dark:border-pink-900 dark:bg-purple-800/40">
                  <p className="text-xs text-zinc-400 dark:text-pink-300">Buluşma Yeri</p>
                  <p className="text-sm font-medium text-zinc-700 dark:text-pink-50">
                    {profile.meetingPlace || "—"}
                  </p>
                </div>
              </div>

              <ContactButtons
                profile={profile}
                whatsappUrl={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              />

              <div className="mt-6 border-t border-zinc-100 pt-6 dark:border-pink-900">
                <h2 className="text-sm font-semibold text-zinc-700 dark:text-pink-50">
                  Hakkında
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-pink-300">
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
