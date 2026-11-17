import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = { title: "Terms of service" };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of service" lead="The agreement between you and ValetKleen." />
      <main id="main" className="wrap main-pad">
        <article className="prose-vk">
          <p>
            <b>Placeholder.</b> ValetKleen&apos;s legal text goes here. The layout supports headings, paragraphs and lists. Replace this
            content with the approved terms, including garment liability, claims windows and plan billing before launch.
          </p>
          <h2>1. Section heading</h2>
          <p>Body text.</p>
        </article>
      </main>
    </>
  );
}
