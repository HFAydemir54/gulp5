import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfileById } from "@/lib/profiles";
import AdSlot from "@/components/AdSlot";
import ImageSlider from "@/components/ImageSlider";
import GtmViewItem from "@/components/GtmViewItem";
import ContactButtons from "@/components/ContactButtons";

export const dynamic = "force-dynamic";

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

  const fullName = `${profile.firstName} ${profile.lastName}`;

  return {
    title: `${fullName} | Profil`,
    description: `${fullName} kullanıcısının profil detayları ve iletişim bilgileri.`,
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

  return (
    <div className="flex flex-1 flex-col bg-white dark:bg-purple-950">
      <GtmViewItem profile={profile} />
      <header className="border-b border-zinc-100 bg-white py-4 text-center dark:border-pink-900 dark:bg-fuchsia-950">
        <h1 className="text-xl font-bold tracking-tight text-zinc-700 dark:text-pink-50">
          {profile.firstName} {profile.lastName}
        </h1>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-4 px-4 py-6">
        <AdSlot
          slotId="1111111111"
          label="Sol Reklam Alanı"
          className="hidden w-40 shrink-0 lg:block lg:h-[600px] lg:sticky lg:top-6"
        />

        <main className="mx-auto min-w-0 w-full max-w-2xl flex-1">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-zinc-600 dark:text-pink-300 dark:hover:text-pink-100"
          >
            ← Tüm profiller
          </Link>

          <div className="mt-4 overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-pink-900 dark:bg-purple-900/40">
            {profile.images && profile.images.length > 0 && (
              <ImageSlider images={profile.images} />
            )}
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-50 text-lg font-semibold text-zinc-500 dark:bg-purple-800/40 dark:text-pink-200">
                  {profile.images && profile.images.length > 0 ? (
                    <img
                      src={profile.images[0]}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      {profile.firstName[0]}
                      {profile.lastName[0]}
                    </>
                  )}
                </div>
                <div>
                  <p className="text-lg font-medium text-zinc-700 dark:text-pink-50">
                    {profile.firstName} {profile.lastName}
                  </p>
                  <p className="text-sm text-zinc-400 dark:text-pink-300">
                    {profile.phone} • {profile.age} Yaşında
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-zinc-100 pt-6 dark:border-pink-900">
                <h2 className="text-sm font-semibold text-zinc-700 dark:text-pink-50">
                  Hakkında
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-pink-300">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>

              <ContactButtons
                profile={profile}
                whatsappUrl={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              />
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
