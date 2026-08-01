import ProfileCardLink from "@/components/ProfileCardLink";
import ProfileCardSlider from "@/components/ProfileCardSlider";
import defaultImage from "@/assets/images/default.webp";
import type { Profile } from "@/lib/profiles";

const outlined = {
  textShadow:
    "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
};

export default function ProfileGrid({
  profiles,
  listName,
}: {
  profiles: Profile[];
  listName: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {profiles.map((profile) => (
        <ProfileCardLink
          key={profile.id}
          profile={profile}
          listName={listName}
          className="relative flex items-stretch gap-1 overflow-hidden rounded-xl border border-[var(--site-border)] bg-[var(--site-card-bg)] shadow-sm transition hover:shadow-md"
        >
          {/* Dekoratif arka plan: her kartta ayrı bir <img> ve 11 girdilik
              srcset üretiyordu. Aynı statik dosya olduğu için CSS arka planına
              çevrildi; görünüm aynı, listede 49 <img> eksiliyor. */}
          <div
            className="absolute left-0 top-0 z-10 h-full w-[35%] overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${defaultImage.src})` }}
          >
            <div className="absolute top-2 left-2 flex flex-col gap-4 italic text-white">
              <h3 className="text-[15px] font-medium leading-tight">
                <span style={{ textShadow: "none" }}>👸</span>
                &nbsp;
                <span style={outlined}>{profile.firstName}</span>
              </h3>
              {profile.city && (
                <p className="text-[13px] leading-tight">
                  <span style={{ textShadow: "none" }}>📍</span>
                  &nbsp;
                  <span style={outlined}>{profile.city}</span>
                </p>
              )}
              {profile.meetingPlace && (
                <p className="text-[13px] leading-tight">
                  <span style={{ textShadow: "none" }}>🛏️</span>
                  &nbsp;
                  <span style={outlined}>{profile.meetingPlace}</span>
                </p>
              )}
            </div>
          </div>
          {profile.images && profile.images.length > 0 ? (
            <ProfileCardSlider
              images={profile.images}
              alt={`${profile.firstName} - ${profile.city} escort`}
            />
          ) : (
            <div className="flex h-[124px] flex-1 items-center justify-center bg-[var(--site-card-bg)] text-sm font-semibold text-[var(--site-muted)]">
              {profile.firstName[0]}
            </div>
          )}
        </ProfileCardLink>
      ))}
    </div>
  );
}
