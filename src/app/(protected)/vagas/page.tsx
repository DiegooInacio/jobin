import type { Metadata } from "next";
import { SectionPreview } from "@/components/ui/section-preview";

export const metadata: Metadata = { title: "Vagas para você | Jobin" };

export default function JobsPage() {
  return (
    <SectionPreview
      title="Vagas para você"
      description="Um lugar para descobrir oportunidades que combinam com seu próximo passo."
      icon="sparkles"
      heading="Novas possibilidades, no seu ritmo."
      message="Este espaço reunirá oportunidades alinhadas ao seu perfil. A descoberta de vagas será implementada nas próximas entregas."
      items={[
        "Preferências de trabalho",
        "Compatibilidade explicada",
        "Fontes de vagas conectadas",
      ]}
    />
  );
}
