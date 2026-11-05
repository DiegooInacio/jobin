"use client";

export default function ProfileError({ reset }: { reset: () => void }) {
  return (
    <div className="page-container">
      <section className="section-preview">
        <span className="subtle-badge">Perfil indisponível</span>
        <h2>Não foi possível carregar seu perfil.</h2>
        <p>
          Tente novamente em instantes. Seus dados salvos não foram alterados.
        </p>
        <button type="button" className="button button-primary" onClick={reset}>
          Tentar novamente
        </button>
      </section>
    </div>
  );
}
