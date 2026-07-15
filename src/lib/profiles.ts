import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { kv } from "@vercel/kv";

export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  age: number;
  city: string;
  meetingPlace: string;
  about: string;
  images: string[];
  createdAt: string;
  expiresAt: string;
};

const DEFAULT_LISTING_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export function isProfileActive(profile: Profile): boolean {
  if (!profile.expiresAt) return true;
  return Date.now() < new Date(profile.expiresAt).getTime();
}

const DATA_FILE = path.join(process.cwd(), "data", "profiles.json");

async function readAll(): Promise<Profile[]> {
  if (process.env.KV_REST_API_URL) {
    try {
      const data = await kv.get<Profile[]>("profiles");
      if (data) return data;

      // KV empty, populate from local json file
      const localRaw = await fs.readFile(DATA_FILE, "utf-8");
      const localProfiles = JSON.parse(localRaw);
      await kv.set("profiles", localProfiles);
      return localProfiles;
    } catch (err) {
      console.error("Vercel KV read error, falling back to local files:", err);
    }
  }

  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

async function writeAll(profiles: Profile[]): Promise<void> {
  if (process.env.KV_REST_API_URL) {
    try {
      await kv.set("profiles", profiles);
      return;
    } catch (err) {
      console.error("Vercel KV write error, falling back to local files:", err);
    }
  }

  await fs.writeFile(DATA_FILE, JSON.stringify(profiles, null, 2), "utf-8");
}

export async function getProfiles(): Promise<Profile[]> {
  return readAll();
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const profiles = await readAll();
  return profiles.find((p) => p.id === id) ?? null;
}

export async function addProfile(input: {
  firstName: string;
  lastName: string;
  phone: string;
  age: number;
  city: string;
  meetingPlace: string;
  about: string;
  images: string[];
  expiresAt?: string;
}): Promise<Profile> {
  const profiles = await readAll();
  const now = Date.now();
  const { expiresAt, ...rest } = input;
  const profile: Profile = {
    id: randomUUID(),
    ...rest,
    createdAt: new Date(now).toISOString(),
    expiresAt: expiresAt || new Date(now + DEFAULT_LISTING_DURATION_MS).toISOString(),
  };
  profiles.push(profile);
  await writeAll(profiles);
  return profile;
}

export async function deleteProfile(id: string): Promise<void> {
  const profiles = await readAll();
  await writeAll(profiles.filter((p) => p.id !== id));
}

export async function updateProfile(
  id: string,
  input: {
    firstName: string;
    lastName: string;
    phone: string;
    age: number;
    city: string;
    meetingPlace: string;
    about: string;
    images: string[];
    expiresAt?: string;
  }
): Promise<Profile | null> {
  const profiles = await readAll();
  const index = profiles.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const { expiresAt, ...rest } = input;
  const profile: Profile = {
    id,
    ...rest,
    createdAt: profiles[index].createdAt,
    expiresAt: expiresAt || profiles[index].expiresAt,
  };
  profiles[index] = profile;
  await writeAll(profiles);
  return profile;
}
