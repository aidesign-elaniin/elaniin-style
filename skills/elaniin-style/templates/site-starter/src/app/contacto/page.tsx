import { PageShell } from "../../components/layout/page-shell";
import { PageHeader } from "../../components/sections/page-header";
import { LinkButton } from "../../components/ui/button";
import { contact } from "../../content/contact";
import { site } from "../../content/site";

export const metadata = { title: contact.title };

// Page type: CONTACT (content: real). No form on purpose: a form with an API is a step up the ladder (references/site-architect.md).
export default function ContactPage() {
  return (
    <PageShell path="/contacto/">
      <PageHeader title={contact.title} lead={contact.lead} />
      <section className="section-y">
        <div className="container-site">
          <LinkButton href={`mailto:${site.email}`} arrow>
            {site.email}
          </LinkButton>
        </div>
      </section>
    </PageShell>
  );
}
