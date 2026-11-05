import type { Identity } from "../auth/service";
import {
  profileDraft,
  type ProfileFormState,
  type ProfileRepository,
} from "./model";
import { validateProfile } from "./validation";

type Session = () => Promise<Identity | null>;

export async function saveMyProfile(
  session: Session,
  repository: ProfileRepository,
  form: FormData,
): Promise<ProfileFormState> {
  let identity;
  try {
    identity = await session();
  } catch {
    return {
      status: "error",
      message: "Não foi possível confirmar sua sessão. Tente novamente.",
    };
  }
  if (!identity)
    return {
      status: "unauthorized",
      message: "Sua sessão expirou. Entre novamente para salvar o perfil.",
    };
  const result = validateProfile(form);
  if (!result.success)
    return {
      status: "invalid",
      message: "Confira os campos destacados antes de salvar.",
      errors: result.errors,
    };
  try {
    // O proprietário vem exclusivamente da identidade confirmada, nunca do formulário.
    await repository.save(identity.id, result.data);
    return {
      status: "saved",
      message: "Perfil salvo com sucesso.",
      values: profileDraft(result.data),
    };
  } catch {
    return {
      status: "error",
      message:
        "Não foi possível salvar agora. Seus dados continuam no formulário; tente novamente.",
    };
  }
}

export async function readMyProfile(
  session: Session,
  repository: ProfileRepository,
) {
  const identity = await session();
  if (!identity) return { status: "unauthorized" as const };
  return {
    status: "ok" as const,
    profile: await repository.findByUserId(identity.id),
  };
}
