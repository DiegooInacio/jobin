import Link from "next/link";
import { ApplicationBoard } from "@/components/application-board";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";

export default function Home() {
  return (
    <div className="page-container">
      <PageHeader
        eyebrow=""
        title="Candidaturas"
        description="Acompanhe suas oportunidades em um só lugar."
        action={
          <Link href="/vagas" className="button button-primary">
            Explorar vagas
            <Icon name="arrow" width="14" height="14" />
          </Link>
        }
      />
      <ApplicationBoard />
      <p className="demo-caption">
        Prévia com dados fictícios. Cadastro e movimentação de candidaturas
        serão adicionados nas próximas entregas.
      </p>
    </div>
  );
}
