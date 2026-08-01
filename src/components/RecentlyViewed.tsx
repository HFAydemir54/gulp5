"use client";

import { useEffect, useState } from "react";
import ProfileGrid from "@/components/ProfileGrid";
import type { Profile } from "@/lib/profiles";
import {
  addRecentlyViewed,
  getRecentlyViewed,
  type RecentlyViewedProfile,
} from "@/lib/recentlyViewed";

// localStorage'daki kayıt sadece kart görünümü için gereken alanları tutar;
// ProfileGrid'in beklediği tam Profile tipine, kullanılmayan alanlar boş
// bırakılarak uyarlanır.
function toProfile(item: RecentlyViewedProfile): Profile {
  return {
    id: item.id,
    firstName: item.firstName,
    city: item.city,
    meetingPlace: item.meetingPlace,
    images: item.image ? [item.image] : [],
    phone: "",
    age: 0,
    about: "",
    createdAt: "",
    expiresAt: item.expiresAt,
  };
}

// Kişiselleştirme localStorage'a bağlı olduğu için sunucu tarafında
// render edilmez; ilk yüklemede boş döner, arama motoruna içerik olarak
// gitmez. Görüntülenen profil kaydedilmeden önceki liste gösterilir, aksi
// halde bir profil kendi kendini önerir.
export default function RecentlyViewed({
  profile,
}: {
  profile: RecentlyViewedProfile;
}) {
  const [items, setItems] = useState<RecentlyViewedProfile[]>([]);

  useEffect(() => {
    setItems(getRecentlyViewed().filter((item) => item.id !== profile.id));
    addRecentlyViewed(profile);
  }, [profile]);

  if (items.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="px-2 text-base font-semibold text-[var(--site-text)]">
        Daha önce gezdikleriniz
      </h2>
      <div className="mt-4">
        <ProfileGrid
          profiles={items.map(toProfile)}
          listName="Daha Önce Gezdikleriniz"
        />
      </div>
    </section>
  );
}
