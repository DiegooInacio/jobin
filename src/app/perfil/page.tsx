import type { Metadata } from "next";
import { SectionPreview } from "@/components/ui/section-preview";

export const metadata: Metadata = { title: "Meu perfil | Jobin" };

export default function ProfilePage() {
  return (
    <SectionPreview
      title="Meu perfil"
      description="Sua experiência, suas habilidades e o que você busca para o futuro."
      icon="user"
      heading="Sua trajetória tem valor."
      message="Aqui você poderá organizar seu perfil profissional e suas preferências. O cadastro e a edição estarão disponíveis em uma próxima entrega."
      items={[
        "Experiência e habilidades",
        "Modelo de trabalho",
        "Preferências profissionais",
      ]}
    />
  );
}
