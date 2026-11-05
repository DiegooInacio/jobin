"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveProfile } from "@/modules/profile/actions";
import {
  employmentLabels,
  employmentTypes,
  experienceLabels,
  experienceLevels,
  profileDraft,
  workModeLabels,
  workModes,
  type ProfileDraft,
  type ProfileField,
  type ProfileFormState,
  type ProfileRecord,
} from "@/modules/profile/model";
import { AuthSubmit } from "./auth-submit";
import { Icon } from "./ui/icon";
import { SelectField } from "./ui/select-field";

type TextName = Exclude<
  ProfileField,
  "workModes" | "employmentTypes" | "experienceLevel"
>;

function TextField({
  name,
  label,
  value,
  onChange,
  error,
  hint,
  required = false,
  maxLength,
  multiline = false,
  type = "text",
  autoComplete,
}: {
  name: TextName;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  maxLength: number;
  multiline?: boolean;
  type?: "text" | "url";
  autoComplete?: string;
}) {
  const id = useId();
  const props = {
    id,
    name,
    value,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => onChange(event.target.value),
    required,
    maxLength,
    "aria-invalid": Boolean(error),
    "aria-describedby": error || hint ? `${id}-help` : undefined,
    autoComplete,
  };
  return (
    <div className={`profile-field${multiline ? " profile-field-wide" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required && (
          <span className="required-mark" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {multiline ? (
        <textarea {...props} rows={name === "summary" ? 4 : 2} />
      ) : (
        <input
          {...props}
          type={type}
          inputMode={name === "minimumSalary" ? "decimal" : undefined}
        />
      )}
      {(error || hint) && (
        <p id={`${id}-help`} className={error ? "field-error" : "field-hint"}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

function Choices<T extends string>({
  name,
  title,
  options,
  labels,
  value,
  onChange,
  error,
}: {
  name: "workModes" | "employmentTypes";
  title: string;
  options: readonly T[];
  labels: Record<T, string>;
  value: T[];
  onChange: (value: T[]) => void;
  error?: string;
}) {
  const id = useId();
  return (
    <fieldset
      className="profile-choices"
      aria-describedby={error ? id : undefined}
    >
      <legend>{title}</legend>
      <div className="profile-choice-options">
        {options.map((option) => (
          <label
            key={option}
            className={`profile-choice${value.includes(option) ? " selected" : ""}`}
          >
            <input
              type="checkbox"
              name={name}
              value={option}
              checked={value.includes(option)}
              onChange={(event) =>
                onChange(
                  event.target.checked
                    ? [...value, option]
                    : value.filter((item) => item !== option),
                )
              }
            />
            <span>{labels[option]}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={id} className="field-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}

function ProfileFields({
  draft,
  update,
  state,
}: {
  draft: ProfileDraft;
  update: <K extends ProfileField>(name: K, value: ProfileDraft[K]) => void;
  state: ProfileFormState;
}) {
  const { pending } = useFormStatus();
  const experienceId = useId();
  const error = (name: ProfileField) => state.errors?.[name];
  const field = (
    name: TextName,
    label: string,
    maxLength: number,
    options: {
      hint?: string;
      required?: boolean;
      multiline?: boolean;
      type?: "text" | "url";
      autoComplete?: string;
    } = {},
  ) => (
    <TextField
      name={name}
      label={label}
      value={draft[name]}
      maxLength={maxLength}
      onChange={(value) => update(name, value)}
      error={error(name)}
      {...options}
    />
  );

  return (
    <fieldset className="profile-fields" disabled={pending}>
      <legend className="sr-only">Dados do perfil profissional</legend>
      <section className="profile-section" aria-labelledby="sobre-voce">
        <div className="profile-section-heading">
          <span>01</span>
          <div>
            <h2 id="sobre-voce">Sobre você</h2>
            <p>Como você quer se apresentar profissionalmente.</p>
          </div>
        </div>
        <div className="profile-grid">
          {field("fullName", "Nome completo", 100, {
            required: true,
            autoComplete: "name",
          })}
          {field("headline", "Cargo ou título profissional", 140, {
            required: true,
            autoComplete: "organization-title",
            hint: "Ex.: Desenvolvedor Front-end",
          })}
          {field("location", "Cidade e estado", 120, {
            autoComplete: "address-level2",
            hint: "Ex.: Fortaleza, CE",
          })}
          <div className="profile-field">
            <label htmlFor={experienceId}>Nível de experiência</label>
            <SelectField
              id={experienceId}
              name="experienceLevel"
              value={draft.experienceLevel}
              onChange={(event) =>
                update(
                  "experienceLevel",
                  event.target.value as ProfileDraft["experienceLevel"],
                )
              }
              icon="briefcase"
              aria-invalid={Boolean(error("experienceLevel"))}
              aria-describedby={
                error("experienceLevel") ? `${experienceId}-error` : undefined
              }
            >
              {experienceLevels.map((level) => (
                <option key={level} value={level}>
                  {experienceLabels[level]}
                </option>
              ))}
            </SelectField>
            {error("experienceLevel") && (
              <p className="field-error" id={`${experienceId}-error`}>
                {error("experienceLevel")}
              </p>
            )}
          </div>
          {field("summary", "Apresentação profissional", 3000, {
            multiline: true,
            hint: "Conte sobre sua experiência, principais entregas e objetivos. Até 3.000 caracteres.",
          })}
        </div>
      </section>
      <section className="profile-section" aria-labelledby="habilidades">
        <div className="profile-section-heading">
          <span>02</span>
          <div>
            <h2 id="habilidades">Habilidades e links</h2>
            <p>Suas competências e os lugares onde seu trabalho aparece.</p>
          </div>
        </div>
        <div className="profile-grid">
          {field("skills", "Habilidades", 1560, {
            multiline: true,
            hint: "Separe por vírgula. Ex.: React, TypeScript, PostgreSQL. Até 30 habilidades.",
          })}
          {field("linkedinUrl", "LinkedIn", 500, {
            type: "url",
            hint: "Endereço completo, começando com https://",
          })}
          {field("githubUrl", "GitHub", 500, { type: "url" })}
          {field("portfolioUrl", "Site ou portfólio", 500, { type: "url" })}
        </div>
      </section>
      <section className="profile-section" aria-labelledby="preferencias">
        <div className="profile-section-heading">
          <span>03</span>
          <div>
            <h2 id="preferencias">O que você busca</h2>
            <p>Campos opcionais. Deixe em branco o que ainda não definiu.</p>
          </div>
        </div>
        <div className="profile-grid">
          {field("desiredRoles", "Cargos de interesse", 1020, {
            multiline: true,
            hint: "Separe por vírgula. Até 10 cargos.",
          })}
          {field("preferredLocations", "Localidades de interesse", 1220, {
            multiline: true,
            hint: "Uma localidade por linha ou separada por ponto e vírgula. Ex.: Fortaleza, CE; São Paulo, SP. Até 10 localidades.",
          })}
          <div className="profile-field-wide">
            <Choices
              name="workModes"
              title="Modelo de trabalho"
              options={workModes}
              labels={workModeLabels}
              value={draft.workModes}
              onChange={(value) => update("workModes", value)}
              error={error("workModes")}
            />
          </div>
          <div className="profile-field-wide">
            <Choices
              name="employmentTypes"
              title="Tipo de contratação"
              options={employmentTypes}
              labels={employmentLabels}
              value={draft.employmentTypes}
              onChange={(value) => update("employmentTypes", value)}
              error={error("employmentTypes")}
            />
          </div>
          {field("minimumSalary", "Remuneração mínima mensal (R$)", 15, {
            hint: "Valor bruto, sem separador de milhar. Ex.: 8500,00. Em branco = não informado.",
          })}
        </div>
      </section>
    </fieldset>
  );
}

export function ProfileForm({
  profile,
  email,
}: {
  profile: ProfileRecord | null;
  email?: string;
}) {
  const [draft, setDraft] = useState(() => profileDraft(profile));
  const [dirty, setDirty] = useState(false);
  const [state, action] = useActionState(saveProfile, { status: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.status === "saved") {
      setDirty(false);
      if (state.values) setDraft(state.values);
    }
    if (state.status === "invalid")
      formRef.current
        ?.querySelector<HTMLElement>('[aria-invalid="true"]')
        ?.focus();
  }, [state]);
  function update<K extends ProfileField>(name: K, value: ProfileDraft[K]) {
    setDraft((previous) => ({ ...previous, [name]: value }));
    setDirty(true);
  }
  const saved = state.status === "saved" && !dirty;

  return (
    <div className="profile-layout">
      <aside className="profile-sidebar">
        <div className="profile-avatar">
          {draft.fullName.trim().charAt(0).toUpperCase() || (
            <Icon name="user" />
          )}
        </div>
        <h2>{draft.fullName || "Seu perfil"}</h2>
        <p className="profile-email">{email}</p>
        <span className="subtle-badge">
          {profile || saved ? "Perfil cadastrado" : "Primeiro cadastro"}
        </span>
        <nav aria-label="Seções do perfil">
          <a href="#sobre-voce">
            Sobre você
            <Icon name="chevron" width="12" height="12" />
          </a>
          <a href="#habilidades">
            Habilidades e links
            <Icon name="chevron" width="12" height="12" />
          </a>
          <a href="#preferencias">
            Preferências
            <Icon name="chevron" width="12" height="12" />
          </a>
        </nav>
        <p className="profile-private-note">
          <Icon name="user" width="14" height="14" />
          Visível apenas para você
        </p>
      </aside>
      <form action={action} ref={formRef} className="profile-form">
        <ProfileFields draft={draft} update={update} state={state} />
        <div className="profile-savebar">
          <div>
            {state.message && (state.status !== "saved" || saved) ? (
              <p
                className={`profile-message${saved ? " success" : ""}`}
                role={saved ? "status" : "alert"}
              >
                {state.message}
              </p>
            ) : (
              <p className="field-hint">
                {dirty
                  ? "Você tem alterações não salvas."
                  : "Os campos com * são obrigatórios."}
              </p>
            )}
            {state.status === "unauthorized" && (
              <a href="/login?next=/perfil" className="profile-login-link">
                Entrar novamente
              </a>
            )}
          </div>
          <AuthSubmit
            pendingText="Salvando..."
            className="button button-primary profile-save-button"
          >
            Salvar perfil
            <Icon name="check" width="15" height="15" />
          </AuthSubmit>
        </div>
      </form>
    </div>
  );
}
