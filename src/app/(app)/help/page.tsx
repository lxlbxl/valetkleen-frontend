import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Card, CardTitle, Kv } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Help" };

const FAQ = [
  { q: "When am I charged?", a: "After your bag is weighed and counted. At booking we save your card but do not charge it. You get a receipt the moment the charge goes through." },
  { q: "What fits in a Standard Bag?", a: "Up to 25 lbs of everyday laundry: washed, dried and folded. Heavier bags are charged as an extra bag, and we tell you before charging." },
  { q: "Do I need to be home?", a: "No. Leave the bag at the door with door notes, or hand it over. We photograph every handoff so you can see it happened." },
  { q: "How long does it take?", a: "Typically 24–48 hours. Express (24 hours) is available where capacity allows." },
  { q: "Who cleans my clothes?", a: "Vetted ValetKleen cleaning partners, to one ValetKleen standard. Every bag is tagged and logged from pickup to delivery." },
  { q: "Something is missing or damaged. What now?", a: "Open the order and choose Report a problem. Add photos. We compare the pickup, intake and delivery photos and reply in the order, usually within one business day." },
  { q: "Can I pause or cancel my Pass?", a: "Yes, whenever you wish, from Plans. Changes apply from your next pickup." },
];

export default function HelpPage() {
  return (
    <>
      <PageHeader eyebrow="Help" title={<>How can we <em>help</em>?</>} lead="Answers to the questions we hear most, and a real person when you need one." photo={{ src: "/img/studio-team.webp", caption: "1 : 1 dedicated support" }} />
      <main id="main" className="wrap main-pad">
        <div className="split">
          <div className="faq card">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <Card variant="dk" className="aside" id="contact">
            <CardTitle>Contact us</CardTitle>
            <Kv label="Text or call" value={<a href="tel:+14045550100">404-555-0100</a>} />
            <Kv label="Email" value={<a href="mailto:hello@valetkleen.com">hello@valetkleen.com</a>} />
            <Kv label="Hours" value="Mon–Sat, 8 am – 8 pm" />
            <p style={{ marginTop: 16, opacity: 0.8, fontSize: 13 }}>Placeholder contact details; replace before launch.</p>
          </Card>
        </div>
      </main>
    </>
  );
}
