import { notFound } from "next/navigation";
import { isAdminEnabled } from "@/lib/auth";

// Panel yalnızca ENABLE_ADMIN=1 olan ortamlarda derlenip sunulur. Üretimde
// /admin isteyen biri, sayfa hiç yokmuş gibi 404 alır.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAdminEnabled()) {
    notFound();
  }
  return <>{children}</>;
}
