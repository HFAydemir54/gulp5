import { notFound, permanentRedirect } from "next/navigation";
import { getProfileById } from "@/lib/profiles";
import { profilePath } from "@/lib/slug";

export const dynamic = "force-dynamic";

// Profil sayfaları /escort/<isim>-<sehir>-<id> adresine taşındı. Eski
// /users/<uuid> bağlantılarının biriktirdiği değeri korumak için 308 ile
// kalıcı yönlendirme yapıyoruz.
export default async function LegacyUserRedirect({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const profile = await getProfileById(userId);

  if (!profile) {
    notFound();
  }

  permanentRedirect(profilePath(profile));
}
