import type { Metadata } from "next";
import { ManagePlan } from "@/components/account/manage-plan";
import { PageHeader } from "@/components/site/page-header";
import { getCurrentCustomer } from "@/lib/api";

export const metadata: Metadata = { title: "Plans" };

/** C6 outside booking: compare and change plans. */
export default async function PlansPage() {
  const me = await getCurrentCustomer();
  return (
    <>
      <PageHeader
        eyebrow="Plans"
        title={
          <>
            Laundry day, <em>on the calendar</em>.
          </>
        }
        lead="Pick a plan to stop paying delivery each time, or keep paying per order. Change or cancel whenever you wish."
        photo={{ src: "/img/family-calendar.webp", caption: "Laundry day, on the calendar" }}
      />
      <main id="main" className="wrap main-pad">
        <ManagePlan current={me.subscription?.plan ?? "per_order"} renewsOn={me.subscription?.renewsOn ?? null} />
      </main>
    </>
  );
}
