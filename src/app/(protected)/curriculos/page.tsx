import type { Metadata } from "next";
import { SectionPreview } from "@/components/ui/section-preview";

export const metadata: Metadata = { title: "Currículos | Jobin" };

export default function ResumesPage() {
  return (
    <SectionPreview
      title="Currículos"
      description="Cada oportunidade merece a versão certa da sua história."
      icon="file"
      heading="Sua história, bem apresentada."
      message="Este espaço guardará suas versões de currículo e o arquivo usado em cada candidatura. O envio de arquivos será implementado em uma próxima entrega."
      items={[
        "Versões organizadas",
        "Arquivos privados",
        "Vínculo com candidaturas",
      ]}
    />
  );
}
