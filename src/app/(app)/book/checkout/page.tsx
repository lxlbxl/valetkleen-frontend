import type { Metadata } from "next";
import { CheckoutStep } from "@/components/booking/checkout-step";
import { PageHeader } from "@/components/site/page-header";
import { Steps } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Review and book" };

export default function BookCheckoutPage() {
  return (
    <>
      <PageHeader
        back={{ href: "/book/plan" }}
        eyebrow="Almost done"
        title={
          <>
            Review and <em>book</em>.
          </>
        }
        photo={{ src: "/img/laundry-room.webp", caption: "Charged after weigh-in" }}
      >
        <Steps current={4} />
      </PageHeader>
      <main id="main" className="wrap main-pad">
        <CheckoutStep />
      </main>
    </>
  );
}
