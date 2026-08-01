import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfiles, isProfileActive } from "@/lib/profiles";
import {
  CATEGORIES,
  applyCategory,
  getCategoryBySlug,
  MIN_INDEXABLE_PROFILES,
} from "@/lib/categories";
import { profilePath } from "@/lib/slug";
import AdSlot from "@/components/AdSlot";
import ProfileGrid from "@/components/ProfileGrid";
import GtmViewItemList from "@/components/GtmViewItemList";
import CategoryNav from "@/components/CategoryNav";
import { SITE_CITY, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const siteUrl = SITE_URL;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return { robots: { index: false, follow: false } };
  }

  const profiles = applyCategory(
    category,
    (await getProfiles()).filter(isProfileActive)
  );
  const pageUrl = `${siteUrl}/${category.slug}`;

  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: pageUrl },
    // Yeterli ilan birikmeden sayfayı indeksletmiyoruz; içi boş kategoriler
    // "thin content" olarak değerlendirilip site geneline zarar veriyor.
    robots:
      profiles.length >= MIN_INDEXABLE_PROFILES
        ? { index: true, follow: true }
        : { index: false, follow: true },
    openGraph: {
      title: category.title,
      description: category.description,
      url: pageUrl,
      siteName: SITE_NAME,
      locale: "tr_TR",
      type: "website",
      images: [{ url: "/icon.png", width: 512, height: 512 }],
    },
  };
}

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category: category.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const profiles = applyCategory(
    category,
    (await getProfiles()).filter(isProfileActive)
  );
  const pageUrl = `${siteUrl}/${category.slug}`;

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url: pageUrl,
    mainEntity: {
      "@type": "ItemList",
      name: category.name,
      numberOfItems: profiles.length,
      itemListElement: profiles.map((profile, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}${profilePath(profile)}`,
        item: {
          "@type": "Person",
          name: profile.firstName,
          description:
            profile.about ||
            `${SITE_CITY} escort ${profile.firstName}, ${profile.city || SITE_CITY} bölgesinde listede yer alıyor.`,
          image: profile.images?.length ? profile.images[0] : undefined,
        },
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: siteUrl },
      { "@type": "ListItem", position: 2, name: category.name, item: pageUrl },
    ],
  };

  return (
    <div className="flex flex-1 flex-col bg-[var(--site-bg)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <GtmViewItemList profiles={profiles} />

      <header className="border-b border-[var(--site-border)] bg-[var(--site-header-bg)] py-4 text-center">
        {/* Emojiler h1'in dışında: başlık etiketi yalnızca hedef anahtar
            kelimeyi içersin, süsleme arama motoruna gürültü olarak gitmesin. */}
        <div
          className="font-bold italic tracking-tight text-[var(--site-accent-strong)]"
          style={{ fontSize: "26px" }}
        >
          <span aria-hidden="true">🔥❤️‍🔥 </span>
          <h1 className="inline">{category.heading}</h1>
          <span aria-hidden="true"> 🔥❤️‍🔥</span>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-4 px-2 py-6">
        <AdSlot
          slotId="1111111111"
          label="Sol Reklam Alanı"
          className="hidden w-40 shrink-0 lg:block lg:h-[600px] lg:sticky lg:top-6"
        />

        <main className="min-w-0 flex-1">
          <nav aria-label="Site haritası" className="px-2 text-xs text-[var(--site-muted)]">
            <Link href="/" className="hover:text-[var(--site-accent-strong)]">
              {SITE_NAME}
            </Link>
            <span className="mx-1">/</span>
            <span className="text-[var(--site-text)]">{category.name}</span>
          </nav>

          <div className="mt-3 space-y-3 rounded-xl border border-[var(--site-border)] bg-[var(--site-card-bg)] p-4">
            {category.intro.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-sm leading-relaxed text-[var(--site-muted)]"
              >
                {paragraph}
              </p>
            ))}
            <p className="text-sm font-medium text-[var(--site-text)]">
              Bu kategoride şu an {profiles.length} aktif ilan bulunuyor.
            </p>
          </div>

          <CategoryNav className="my-4" activeSlug={category.slug} />

          {profiles.length > 0 ? (
            <ProfileGrid profiles={profiles} listName={category.name} />
          ) : (
            <p className="rounded-xl border border-[var(--site-border)] bg-[var(--site-card-bg)] p-6 text-center text-sm text-[var(--site-muted)]">
              Bu kategoride şu an yayında olan ilan yok.{" "}
              <Link href="/" className="text-[var(--site-accent-strong)] underline">
                Tüm ilanlara göz atın
              </Link>
              .
            </p>
          )}

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
