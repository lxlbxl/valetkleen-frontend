import type { Metadata } from "next";
import { PlanStep } from "@/components/booking/plan-step";
import { PageHeader } from "@/components/site/page-header";
import { Steps } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Choose a plan" };

export default function BookPlanPage() {
  return (
    <>
      <PageHeader
        back={{ href: "/book/pickup" }}
        eyebrow="Make it a habit?"
        title={
          <>
            A plan could save you <em>delivery fees</em>.
          </>
        }
        lead="Based on your order. You can skip this and pay per order."
        photo={{ src: "/img/family-calendar.webp", caption: "Laundry day, on the calendar" }}
      >
        <Steps current={3} />
      </PageHeader>
      <main id="main" className="wrap main-pad">
        <PlanStep />
      </main>
    </>
  );
}
