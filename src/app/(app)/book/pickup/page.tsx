import type { Metadata } from "next";
import { PickupStep } from "@/components/booking/pickup-step";
import { PageHeader } from "@/components/site/page-header";
import { Steps } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Choose a pickup window" };

export default function BookPickupPage() {
  return (
    <>
      <PageHeader
        back={{ href: "/book" }}
        eyebrow="Book a pickup"
        title={
          <>
            When should we <em>come</em>?
          </>
        }
        photo={{ src: "/img/handoff-2.webp", caption: "Hand it over, or leave it out" }}
      >
        <Steps current={2} />
      </PageHeader>
      <main id="main" className="wrap main-pad">
        <PickupStep />
      </main>
    </>
  );
}
