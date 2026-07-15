"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import type { Profile } from "@/lib/profiles";

function isExpired(profile: Profile): boolean {
  if (!profile.expiresAt) return false;
  return Date.now() >= new Date(profile.expiresAt).getTime();
}

function formatPhone(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("90")) digits = digits.slice(2);
  if (!digits.startsWith("0")) digits = `0${digits}`;
  digits = digits.slice(0, 11);

  const zero = digits.slice(0, 1);
  const area = digits.slice(1, 4);
  const rest = [digits.slice(4, 7), digits.slice(7, 9), digits.slice(9, 11)].filter(
    Boolean
  );

  let result = zero;
  if (area) result += ` (${area}${area.length === 3 ? ")" : ""}`;
  if (rest.length) result += ` ${rest.join(" ")}`;

  return result;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [meetingPlace, setMeetingPlace] = useState("");
  const [about, setAbout] = useState("");
  const [images, setImages] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [formError, setFormError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showExpiredOnly, setShowExpiredOnly] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/status")
      .then((r) => r.json())
      .then((data) => setAuthenticated(Boolean(data.authenticated)));
  }, []);

  useEffect(() => {
    if (authenticated) loadProfiles();
  }, [authenticated]);

  async function loadProfiles() {
    const res = await fetch("/api/profiles");
    setProfiles(await res.json());
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
      setPassword("");
    } else {
      setLoginError("Şifre hatalı");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthenticated(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    const parsedImages = images
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);
    const res = await fetch(
      editingId ? `/api/profiles/${editingId}` : "/api/profiles",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          phone,
          age: age ? Number(age) : undefined,
          city,
          meetingPlace,
          about,
          images: parsedImages,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        }),
      }
    );
    if (res.ok) {
      setFirstName("");
      setPhone("");
      setAge("");
      setCity("");
      setMeetingPlace("");
      setAbout("");
      setImages("");
      setExpiresAt("");
      setEditingId(null);
      loadProfiles();
    } else {
      const data = await res.json();
      setFormError(data.error || "Bir hata oluştu");
    }
  }

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setFormError("");
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Yükleme başarısız");
        }
        const data = await res.json();
        uploadedUrls.push(data.url);
      }
      setImages((prev) =>
        [prev, ...uploadedUrls].filter(Boolean).join("\n")
      );
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Yükleme başarısız");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function handleEdit(profile: Profile) {
    setEditingId(profile.id);
    setFirstName(profile.firstName);
    setPhone(profile.phone);
    setAge(profile.age ? String(profile.age) : "");
    setCity(profile.city || "");
    setMeetingPlace(profile.meetingPlace || "");
    setAbout(profile.about || "");
    setImages(profile.images ? profile.images.join("\n") : "");
    setExpiresAt(profile.expiresAt ? profile.expiresAt.slice(0, 10) : "");
    setFormError("");
  }

  function handleCancelEdit() {
    setEditingId(null);
    setFirstName("");
    setPhone("");
    setAge("");
    setCity("");
    setMeetingPlace("");
    setAbout("");
    setImages("");
    setExpiresAt("");
    setFormError("");
  }

  async function handleDelete(id: string) {
    await fetch(`/api/profiles/${id}`, { method: "DELETE" });
    if (editingId === id) handleCancelEdit();
    loadProfiles();
  }

  if (authenticated === null) {
    return <div className="flex flex-1 items-center justify-center">Yükleniyor...</div>;
  }

  if (!authenticated) {
    return (
      <div className="flex flex-1 items-center justify-center bg-white dark:bg-purple-950">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-pink-900 dark:bg-purple-900/40"
        >
          <h1 className="mb-4 text-xl font-semibold text-zinc-700 dark:text-pink-50">
            Admin Girişi
          </h1>
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-3 w-full rounded-lg border border-zinc-200 px-3 py-2 dark:border-pink-800 dark:bg-purple-800/40"
            required
          />
          {loginError && (
            <p className="mb-3 text-sm text-red-600">{loginError}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 dark:bg-pink-100 dark:text-purple-900"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-700 dark:text-pink-50">
          Profil Yönetimi
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm text-zinc-400 underline hover:text-zinc-700 dark:hover:text-pink-100"
        >
          Çıkış yap
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid grid-cols-1 gap-3 rounded-xl border border-zinc-100 bg-white p-5 dark:border-pink-900 dark:bg-purple-900/40 sm:grid-cols-4"
      >
        <input
          placeholder="İsim"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-2 dark:border-pink-800 dark:bg-purple-800/40"
          required
        />
        <input
          placeholder="0 (000) 000 00 00"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          inputMode="numeric"
          maxLength={18}
          className="rounded-lg border border-zinc-200 px-3 py-2 dark:border-pink-800 dark:bg-purple-800/40"
          required
        />
        <input
          type="number"
          placeholder="Yaş"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          min={1}
          max={120}
          className="rounded-lg border border-zinc-200 px-3 py-2 dark:border-pink-800 dark:bg-purple-800/40"
          required
        />
        <input
          placeholder="Şehir"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-2 dark:border-pink-800 dark:bg-purple-800/40"
          required
        />
        <input
          placeholder="Buluşma Yeri"
          value={meetingPlace}
          onChange={(e) => setMeetingPlace(e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-2 dark:border-pink-800 dark:bg-purple-800/40"
          required
        />
        <label className="col-span-full flex flex-col gap-1 text-sm text-zinc-500 dark:text-pink-200 sm:col-span-2">
          İlan bitiş tarihi (boş bırakılırsa 1 hafta sonra)
          <input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="rounded-lg border border-zinc-200 px-3 py-2 dark:border-pink-800 dark:bg-purple-800/40"
          />
        </label>
        <textarea
          placeholder="Hakkında (detay sayfasında gösterilecek bilgilendirme metni)"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          rows={3}
          className="col-span-full rounded-lg border border-zinc-200 px-3 py-2 dark:border-pink-800 dark:bg-purple-800/40 text-sm"
        />
        <div className="col-span-full flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-zinc-500 dark:text-pink-200">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="text-sm"
            />
            {uploading && <span>Yükleniyor...</span>}
          </label>
          <textarea
            placeholder="Resim URL'leri (Her satıra bir adet gelecek şekilde ekleyin, ya da yukarıdan dosya yükleyin)"
            value={images}
            onChange={(e) => setImages(e.target.value)}
            rows={2}
            className="rounded-lg border border-zinc-200 px-3 py-2 dark:border-pink-800 dark:bg-purple-800/40 text-sm"
          />
        </div>
        <div className="col-span-full flex justify-end gap-2">
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-6 py-2 text-white hover:bg-zinc-700 dark:bg-pink-100 dark:text-purple-900"
          >
            {editingId ? "Güncelle" : "Ekle"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-lg border border-zinc-200 px-6 py-2 text-zinc-600 hover:bg-zinc-50 dark:border-pink-800 dark:text-zinc-200 dark:hover:bg-purple-800/40"
            >
              Vazgeç
            </button>
          )}
        </div>
        {formError && (
          <p className="col-span-full text-sm text-red-600">{formError}</p>
        )}
      </form>

      <label className="mb-3 flex items-center gap-2 text-sm text-zinc-500 dark:text-pink-200">
        <input
          type="checkbox"
          checked={showExpiredOnly}
          onChange={(e) => setShowExpiredOnly(e.target.checked)}
        />
        Süresi dolmuşları göster
      </label>

      <div className="space-y-2">
        {profiles
          .filter((profile) => (showExpiredOnly ? isExpired(profile) : true))
          .map((profile) => (
          <div
            key={profile.id}
            className="flex items-center justify-between rounded-lg border border-zinc-100 bg-white px-4 py-3 dark:border-pink-900 dark:bg-purple-900/40"
          >
            <div>
              <p className="font-medium text-zinc-700 dark:text-pink-50">
                {profile.firstName} <span className="text-sm font-normal text-zinc-300 dark:text-pink-400">(Yaş: {profile.age})</span>
              </p>
              <p className="text-sm text-zinc-400 dark:text-pink-300">
                {profile.phone}
              </p>
              {profile.expiresAt && (
                <p
                  className={
                    isExpired(profile)
                      ? "text-xs font-medium text-red-600"
                      : "text-xs text-zinc-300 dark:text-pink-400"
                  }
                >
                  Bitiş: {new Date(profile.expiresAt).toLocaleDateString("tr-TR")}
                  {isExpired(profile) && " (süresi doldu)"}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleEdit(profile)}
                className="text-sm text-zinc-500 hover:underline dark:text-pink-200"
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(profile.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
