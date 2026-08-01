"use client";

import { useEffect, useState } from "react";
import ProfileGrid from "@/components/ProfileGrid";
import {
  addRecentlyViewed,
  getRecentlyViewed,
  toProfile,
  type RecentlyViewedProfile,
} from "@/lib/recentlyViewed";

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
    // localStorage'a erişim sadece client'ta mümkün; sunucu render'ıyla
    // eşleşmesi için bu okuma bilerek effect içinde yapılıyor.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
