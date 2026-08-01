import Link from "next/link";
import { CATEGORIES, categoryPath } from "@/lib/categories";
import { SITE_CITY, SITE_NAME, SITE_WHATSAPP } from "@/lib/site";

// Footer her sayfada göründüğü için kategori sayfalarına site geneli iç link
// sağlıyor. Bağlantıları bilerek az tutuyoruz: footer'ı anahtar kelimeyle
// doldurmak Google'ın link spam politikasına giren bir kalıp.
export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--site-border)] bg-[var(--site-header-bg)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-base font-bold italic text-[var(--site-accent-strong)]">
              {SITE_NAME}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--site-muted)]">
              {SITE_CITY} ve çevresindeki güncel escort ilanları. Süresi dolan
              ilanlar listeden otomatik olarak kaldırılır, bu sayfalarda yalnızca
              yayında olan ilanlar görünür.
            </p>
          </div>

          <nav aria-labelledby="footer-kategoriler">
            <p
              id="footer-kategoriler"
              className="text-sm font-semibold text-[var(--site-text)]"
            >
              Kategoriler
            </p>
            <ul className="mt-3 space-y-2">
              {CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={categoryPath(category)}
                    className="text-sm text-[var(--site-muted)] transition-colors hover:text-[var(--site-accent-strong)]"
                  >
                    {category.heading}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-sm font-semibold text-[var(--site-text)]">
              İlan vermek istiyorum
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--site-muted)]">
              İlanınızı yayınlatmak için WhatsApp üzerinden ulaşabilirsiniz.
            </p>
            <a
              href={`https://wa.me/${SITE_WHATSAPP}?text=Merhaba%2C%20ilanımı%20yayınlamak%20istiyorum.`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center rounded-lg border border-[var(--site-banner-border)] bg-[var(--site-banner-bg)] px-4 py-2 text-sm font-semibold text-[var(--site-accent-strong)] transition-colors hover:bg-[var(--site-banner-bg-hover)]"
            >
              WhatsApp ile iletişime geç
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--site-border)] pt-6">
          <p className="text-xs leading-relaxed text-[var(--site-muted)]">
            <strong className="text-[var(--site-text)]">18+</strong> Bu site
            yalnızca 18 yaşını doldurmuş kişilere yöneliktir. Sitede yer alan
            ilanlar, ilan sahipleri tarafından iletilen bilgilerden oluşur;
            içeriklerin doğruluğu ilan sahibinin sorumluluğundadır. Site
            üzerinden herhangi bir hizmet satışı veya aracılık yapılmaz.
          </p>
          <p className="mt-4 text-xs text-[var(--site-muted)]">
            © {year} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
