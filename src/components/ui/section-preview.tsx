import Link from "next/link";
import { Icon, type IconName } from "./icon";
import { PageHeader } from "./page-header";

export function SectionPreview({
  title,
  description,
  icon,
  heading,
  message,
  items,
}: {
  title: string;
  description: string;
  icon: IconName;
  heading: string;
  message: string;
  items: string[];
}) {
  return (
    <div className="page-container">
      <PageHeader
        eyebrow="SUA JORNADA PROFISSIONAL"
        title={title}
        description={description}
      />
      <section className="section-preview" aria-labelledby="preview-title">
        <span className="empty-icon">
          <Icon name={icon} width="30" height="30" />
        </span>
        <span className="subtle-badge">Em breve</span>
        <h2 id="preview-title">{heading}</h2>
        <p>{message}</p>
        <ul className="preview-features">
          {items.map((item) => (
            <li key={item}>
              <span />
              {item}
            </li>
          ))}
        </ul>
        <Link href="/" className="button button-primary">
          Explorar o quadro
          <Icon name="arrow" />
        </Link>
      </section>
    </div>
  );
}
