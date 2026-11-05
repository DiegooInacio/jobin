import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";
import { PageHeader } from "@/components/ui/page-header";
import { currentIdentity } from "@/modules/auth/session";
import { profileRepository } from "@/modules/profile/repository";
import { readMyProfile } from "@/modules/profile/service";

export const metadata: Metadata = { title: "Meu perfil | Jobin" };

export default async function ProfilePage() {
  const result = await readMyProfile(currentIdentity, profileRepository);
  if (result.status === "unauthorized") redirect("/login?next=/perfil");
  const identity = await currentIdentity();
  if (!identity) redirect("/login?next=/perfil");
  return (
    <div className="page-container profile-page">
      <PageHeader
        eyebrow=""
        title="Meu perfil"
        description="Sua experiência, suas habilidades e o próximo passo que você busca."
      />
      <ProfileForm
        key={identity.id}
        profile={result.profile}
        email={identity.email}
      />
    </div>
  );
}
