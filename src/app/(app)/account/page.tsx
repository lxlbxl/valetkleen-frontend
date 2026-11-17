import type { Metadata } from "next";
import Link from "next/link";
import { ProfileForm } from "@/components/account/profile-form";
import { PageHeader } from "@/components/site/page-header";
import { Badge, Card, CardTitle, Kv } from "@/components/ui/primitives";
import { getCurrentCustomer } from "@/lib/api";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const me = await getCurrentCustomer();
  return (
    <>
      <PageHeader eyebrow="Account" title={<>Your <em>details</em>.</>} lead="Contact details, addresses, cards and notifications." photo={{ src: "/img/tote-window.webp", caption: "Exactly how you like it" }} />
      <main id="main" className="wrap main-pad">
        <div className="split">
          <div className="stack" data-stg>
            <ProfileForm initial={{ name: me.name, email: me.email, phone: me.phone, notifications: me.notifications }} />
            <Card>
              <div className="row sb">
                <CardTitle>Addresses</CardTitle>
                <Link className="lnk" href="/help#contact">Add address</Link>
              </div>
              {me.addresses.map((a) => (
                <div className="item" key={a.id}>
                  <div>
                    <b>{a.line}</b>
                    <small>{a.doorNotes || "No door notes"}</small>
                  </div>
                  {a.isDefault && <Badge tone="ok">Default</Badge>}
                </div>
              ))}
            </Card>
            <Card>
              <div className="row sb">
                <CardTitle>Cards</CardTitle>
                {/* TODO(backend): Stripe SetupIntent to add a card. */}
                <Link className="lnk" href="/help#contact">Add card</Link>
              </div>
              {me.cards.map((c) => (
                <div className="item" key={c.id}>
                  <div>
                    <b>{c.brand} •••• {c.last4}</b>
                    <small>Expires {c.exp}</small>
                  </div>
                  {c.isDefault && <Badge tone="ok">Default</Badge>}
                </div>
              ))}
              <p className="mut" style={{ marginTop: 10 }}>Cards are charged after weigh-in, never at booking.</p>
            </Card>
          </div>
          <aside className="aside stack">
            <Card variant="dk">
              <CardTitle>Refer a friend</CardTitle>
              <p style={{ opacity: 0.85, marginTop: 6 }}>Share your code. You both get $10 off after their first order.</p>
              <p style={{ font: "var(--hw) 30px/1.2 var(--hf)", color: "#fff", marginTop: 16, letterSpacing: ".06em" }}>{me.referralCode}</p>
            </Card>
            <Card variant="sub">
              <Kv label="Plan" value={me.subscription ? (me.subscription.plan === "pass" ? "Pass" : "Family") : "Pay per order"} />
              <Link className="lnk" href="/plans">Manage plan</Link>
            </Card>
            <Card variant="sub">
              <CardTitle>Your data</CardTitle>
              <p className="mut">Download everything we hold about you, or close your account.</p>
              <div className="row" style={{ marginTop: 14 }}>
                <Link className="lnk" href="/help#contact">Export my data</Link>
                <Link className="lnk" href="/help#contact">Close account</Link>
              </div>
            </Card>
            <Link className="btn g block" href="/sign-in">Sign out</Link>
          </aside>
        </div>
      </main>
    </>
  );
}
