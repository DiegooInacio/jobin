"use server";
import { revalidatePath } from "next/cache";
import { currentIdentity } from "@/modules/auth/session";
import { profileRepository } from "./repository";
import { saveMyProfile } from "./service";
import type { ProfileFormState } from "./model";

export async function saveProfile(
  _previous: ProfileFormState,
  form: FormData,
): Promise<ProfileFormState> {
  const result = await saveMyProfile(currentIdentity, profileRepository, form);
  if (result.status === "saved") revalidatePath("/perfil");
  return result;
}
