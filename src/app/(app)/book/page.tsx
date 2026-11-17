import type { Metadata } from "next";
import { ServiceStep } from "@/components/booking/service-step";
import { PageHeader } from "@/components/site/page-header";
import { Steps } from "@/components/ui/primitives";
import { getCatalog } from "@/lib/api";

export const metadata: Metadata = { title: "Book a pickup" };

export default async function BookServicePage() {
  const catalog = await getCatalog();
  return (
    <>
      <PageHeader
        back={{ href: "/" }}
        eyebrow="Book a pickup"
        title={
          <>
            What are we <em>cleaning</em>?
          </>
        }
        lead="Totals here are estimates. Real weight and item count are confirmed after pickup."
        photo={{ src: "/img/bag.webp", caption: "One bag for everything" }}
      >
        <Steps current={1} />
      </PageHeader>
      <main id="main" className="wrap main-pad">
        <ServiceStep catalog={catalog} />
      </main>
    </>
  );
}
