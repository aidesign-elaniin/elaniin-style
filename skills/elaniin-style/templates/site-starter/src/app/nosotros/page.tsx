import { PageShell } from "../../components/layout/page-shell";
import { PageHeader } from "../../components/sections/page-header";
import { TeamGrid } from "../../components/sections/team-grid";
import { about } from "../../content/about";

export const metadata = { title: about.title };

// Page type: ABOUT (content: placeholder).
export default function AboutPage() {
  return (
    <PageShell path="/nosotros/">
      <PageHeader title={about.title} lead={about.lead} placeholder />
      <TeamGrid title={about.teamTitle} people={about.team} />
    </PageShell>
  );
}
