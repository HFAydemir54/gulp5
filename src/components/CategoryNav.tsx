import Link from "next/link";
import { CATEGORIES, categoryPath } from "@/lib/categories";

// Kategoriler arası iç linkleme. Her sayfadan diğerlerine bağlantı vererek
// arama motorunun tüm kategori sayfalarını taramasını sağlar.
export default function CategoryNav({
  activeSlug,
  className,
}: {
  activeSlug?: string;
  className?: string;
}) {
  return (
    <nav
      aria-label="Escort kategorileri"
      className={`flex flex-wrap gap-2 px-2 ${className ?? ""}`}
    >
      {CATEGORIES.map((category) => {
        const isActive = category.slug === activeSlug;
        return (
          <Link
            key={category.slug}
            href={categoryPath(category)}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${
              isActive
                ? "border-[var(--site-accent-strong)] bg-[var(--site-accent-strong)] text-white"
                : "border-[var(--site-border)] bg-[var(--site-card-bg)] text-[var(--site-text)] hover:border-[var(--site-accent-strong)] hover:text-[var(--site-accent-strong)]"
            }`}
          >
            {category.heading}
          </Link>
        );
      })}
    </nav>
  );
}
