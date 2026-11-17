import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = { title: "Privacy policy" };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy policy" lead="What we collect, why, and how to control it." />
      <main id="main" className="wrap main-pad">
        <article className="prose-vk">
          <p>
            <b>Placeholder.</b> ValetKleen&apos;s legal text goes here. The layout supports headings, paragraphs and lists. Replace this
            content with the approved policy, including data retention, analytics and export or deletion requests before launch.
          </p>
          <h2>1. Section heading</h2>
          <p>Body text.</p>
        </article>
      </main>
    </>
  );
}
