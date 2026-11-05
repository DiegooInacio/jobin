"use client";

import { useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { SelectField } from "@/components/ui/select-field";

const stages = [
  { id: "saved", label: "Vagas salvas", icon: "file" },
  { id: "applied", label: "Enviadas", icon: "briefcase" },
  { id: "interview", label: "Entrevistas", icon: "user" },
  { id: "rejected", label: "Encerradas", icon: "closed" },
  { id: "offer", label: "Propostas", icon: "check" },
] as const;

const examples = [
  {
    id: 1,
    title: "Desenvolvedor(a) Front-end",
    company: "Aurora Digital",
    initials: "AD",
    color: "peach",
    location: "São Paulo, SP",
    mode: "Remoto",
    level: "Pleno",
    stage: "saved",
    note: "Explorar oportunidade",
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Estúdio Norte",
    initials: "en",
    color: "lavender",
    location: "Recife, PE",
    mode: "Híbrido",
    level: "Sênior",
    stage: "saved",
    note: "Explorar oportunidade",
  },
  {
    id: 3,
    title: "Engenheiro(a) de Software",
    company: "Órbita Tech",
    initials: "Ó",
    color: "mint",
    location: "Brasil",
    mode: "Remoto",
    level: "Pleno",
    stage: "applied",
    note: "Aguardando retorno",
  },
  {
    id: 4,
    title: "Desenvolvedor(a) Full Stack",
    company: "Ponto Azul",
    initials: "pa",
    color: "sky",
    location: "Fortaleza, CE",
    mode: "Híbrido",
    level: "Pleno",
    stage: "applied",
    note: "Aguardando retorno",
  },
  {
    id: 5,
    title: "UX Designer",
    company: "Forma",
    initials: "f.",
    color: "sand",
    location: "Brasil",
    mode: "Remoto",
    level: "Pleno",
    stage: "interview",
    note: "Conversa com o time",
  },
  {
    id: 6,
    title: "Desenvolvedor(a) React",
    company: "Verde Labs",
    initials: "v",
    color: "mint",
    location: "Brasil",
    mode: "Remoto",
    level: "Sênior",
    stage: "offer",
    note: "Avaliar próximos passos",
  },
  {
    id: 7,
    title: "UI Designer",
    company: "Atlas Studio",
    initials: "as",
    color: "sky",
    location: "Belo Horizonte, MG",
    mode: "Híbrido",
    level: "Pleno",
    stage: "saved",
    note: "Explorar oportunidade",
  },
  {
    id: 8,
    title: "Desenvolvedor(a) Back-end",
    company: "Horizonte",
    initials: "h",
    color: "peach",
    location: "Brasil",
    mode: "Remoto",
    level: "Sênior",
    stage: "interview",
    note: "Entrevista técnica",
  },
  {
    id: 9,
    title: "Product Designer",
    company: "Vértice",
    initials: "V",
    color: "lavender",
    location: "São Paulo, SP",
    mode: "Híbrido",
    level: "Pleno",
    stage: "interview",
    note: "Conversa com o time",
  },
  {
    id: 10,
    title: "Engenheiro(a) Front-end",
    company: "Nuvem",
    initials: "n",
    color: "sky",
    location: "Brasil",
    mode: "Remoto",
    level: "Pleno",
    stage: "rejected",
    note: "Processo finalizado",
  },
  {
    id: 11,
    title: "UX Designer",
    company: "Lume",
    initials: "L",
    color: "sand",
    location: "Curitiba, PR",
    mode: "Híbrido",
    level: "Sênior",
    stage: "rejected",
    note: "Processo finalizado",
  },
];

export function ApplicationBoard() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("Todos");
  const searchInput = useRef<HTMLInputElement>(null);
  const searchId = useId();
  const modeId = useId();
  const search = query
    .trim()
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const filtered = examples.filter((job) => {
    const text = `${job.title} ${job.company} ${job.location}`
      .toLocaleLowerCase("pt-BR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return text.includes(search) && (mode === "Todos" || job.mode === mode);
  });

  return (
    <>
      <div className="board-toolbar">
        <div className="board-view">
          <Icon name="board" />
          <span>Quadro</span>
        </div>
        <div
          className="board-filters"
          role="search"
          aria-label="Filtrar oportunidades de exemplo"
        >
          <div className="search-field">
            <Icon name="search" />
            <label className="sr-only" htmlFor={searchId}>
              Buscar nos exemplos por cargo, empresa ou local
            </label>
            <input
              id={searchId}
              ref={searchInput}
              type="search"
              placeholder="Buscar cargo, empresa ou local"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                className="search-clear"
                aria-label="Limpar busca"
                onClick={() => {
                  setQuery("");
                  searchInput.current?.focus();
                }}
              >
                <Icon name="close" width="13" height="13" />
              </button>
            )}
          </div>
          <label className="sr-only" htmlFor={modeId}>
            Modelo de trabalho
          </label>
          <SelectField
            active={mode !== "Todos"}
            id={modeId}
            value={mode}
            onChange={(event) => setMode(event.target.value)}
            aria-label="Modelo de trabalho"
          >
            <option value="Todos">Todos os modelos</option>
            <option>Remoto</option>
            <option>Híbrido</option>
          </SelectField>
        </div>
      </div>
      <div className="results-row">
        <p className="results-caption" role="status">
          {filtered.length}{" "}
          {filtered.length === 1
            ? "oportunidade de exemplo"
            : "oportunidades de exemplo"}
          {query || mode !== "Todos" ? " encontradas" : " no quadro"}
        </p>
        {(query || mode !== "Todos") && (
          <button
            type="button"
            className="clear-filters"
            onClick={() => {
              setQuery("");
              setMode("Todos");
            }}
          >
            <Icon name="close" width="12" height="12" />
            Limpar filtros
          </button>
        )}
      </div>
      <div
        className="board"
        role="region"
        tabIndex={0}
        aria-label="Prévia do quadro de candidaturas; role horizontalmente para ver todas as etapas"
      >
        {stages.map((stage) => {
          const jobs = filtered.filter((job) => job.stage === stage.id);
          return (
            <section
              className="board-column"
              key={stage.id}
              aria-labelledby={`stage-${stage.id}`}
            >
              <div className="column-heading">
                <h2 id={`stage-${stage.id}`}>
                  <Icon name={stage.icon} width="14" height="14" />
                  {stage.label}
                </h2>
                <span className="column-count">{jobs.length}</span>
              </div>
              <div className="column-cards">
                {jobs.map((job) => (
                  <article className="job-card" key={job.id}>
                    <div className="company-row">
                      <span className={`company-logo logo-${job.color}`}>
                        {job.initials}
                      </span>
                      <span className="company-name">{job.company}</span>
                    </div>
                    <h3>{job.title}</h3>
                    <p className="job-location">
                      <Icon name="location" width="14" height="14" />
                      {job.location}
                    </p>
                    <div className="job-tags">
                      <span>{job.mode}</span>
                      <span>{job.level}</span>
                    </div>
                    <div className="card-footer">
                      <span className="small-dot" />
                      {job.note}
                    </div>
                  </article>
                ))}
                {jobs.length === 0 && (
                  <div className="column-empty">
                    Nenhum exemplo nesta etapa
                    {query || mode !== "Todos" ? " com os filtros atuais" : ""}.
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
