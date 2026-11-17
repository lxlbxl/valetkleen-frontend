import Image from "next/image";
import Link from "next/link";
import { PriceTabs, type PriceTab } from "@/components/home/price-tabs";
import { ZipForm } from "@/components/home/zip-form";
import { Words } from "@/components/home/words";
import { getCatalog, getPriceBook } from "@/lib/api";
import { moneyShort } from "@/lib/format";

const FEATURED = ["Golf Shirt", "Cardigan", "Turtleneck", "Jeans", "Skirt", "Trench Coat", "Lady Jacket", "Hood Jacket", "Raincoat", "2pc Dashiki", "3pc Agbada", "3/4 Coat"];

const STEPS = [
  { title: "Schedule", text: "Choose a day and two-hour window. Leave it at the door or hand it over personally.", img: "/img/bag.webp", cap: "Fig. 01 · The ValetKleen bag" },
  { title: "Collect & weigh", text: "Every bag is weighed at intake. The final price is confirmed, then charged. Never before.", img: "/img/handoff.webp", cap: "Fig. 02 · Collected at your door" },
  { title: "Clean with care", text: "Washed, dried, pressed and folded to standard by vetted professionals.", img: "/img/studio-fold.webp", cap: "Fig. 03 · Weighed, cleaned, folded" },
  { title: "Return", text: "Follow every step live. Delivered fresh and folded, at the time promised.", img: "/img/family-home.webp", cap: "Fig. 04 · Returned, on time" },
];

const MOSAIC_A = ["studio-store", "tote-window", "studio-fold", "family-calendar", "pressing", "handoff-2", "laundry-room"];
const MOSAIC_B = ["iron-stack", "studio-front", "bag", "family-home", "studio-team", "handoff", "tote-window"];

export default async function HomePage() {
  const [catalog, book] = await Promise.all([getCatalog(), getPriceBook()]);
  const dc = catalog.filter((i) => i.service === "dry_cleaning");
  const po = catalog.filter((i) => i.service === "press_only");
  const hd = catalog.filter((i) => i.service === "hang_dry");
  const linens = dc.filter((i) => i.category === "Household / Linens");
  const pick = (list: typeof dc) => FEATURED.map((n) => list.find((i) => i.name === n)).filter((x): x is NonNullable<typeof x> => !!x);
  const tabs: PriceTab[] = [
    { key: "dc", label: "Dry cleaning", count: dc.length, items: pick(dc) },
    { key: "po", label: "Press only", count: po.length, items: [...pick(po), ...po.filter((i) => ["Hat", "Gloves", "Apron"].includes(i.name))].slice(0, 12) },
    { key: "hd", label: "Hang dry", count: hd.length, items: hd },
    { key: "hm", label: "Home and linens", count: linens.length, items: linens.slice(0, 12) },
  ];

  return (
    <div className="vk-home">
      <nav aria-label="Main">
        <Link href="/" aria-label="ValetKleen home">
          <Image src="/brand/logo-white.png" alt="ValetKleen" width={158} height={24} priority />
        </Link>
        <span className="sp" />
        <a className="l" href="#process">Process</a>
        <a className="l" href="#services">Services</a>
        <a className="l" href="#prices">Prices</a>
        <a className="l" href="#pass">The Pass</a>
        <Link className="l" href="/sign-in">Sign in</Link>
        <Link className="btn s" href="/book" style={{ padding: "13px 24px" }}>
          Book
        </Link>
      </nav>

      <main id="main">
        {/* Hero: Style B (arch, sun, hills and van), per Alex's direction. */}
        <header className="hero">
          <div className="vert" aria-hidden="true">Metro Atlanta · Est. 2026</div>
          <div className="wrap">
            <div>
              <div className="kick">The laundry concierge</div>
              <h1>
                Your laundry,
                <br />
                <em>quietly</em> taken
                <br />
                care of.
              </h1>
              <p className="lead">A personal pickup and delivery service for people whose time matters. Expert cleaning, careful handling, returned to your door on your schedule.</p>
              <ZipForm />
              <div className="zh">
                Not sure? <Link href="/check?zip=30601">See what happens outside our area</Link>
              </div>
            </div>
            <div className="arch" aria-hidden="true">
              <div className="frame">
                <div className="sun" />
                <svg className="hills" viewBox="0 0 470 260" preserveAspectRatio="none" height="260">
                  <path d="M0 120 Q90 60 190 110 T470 80V260H0z" fill="#0b4a7a" />
                  <path d="M0 170 Q120 110 250 160 T470 140V260H0z" fill="#0a3a5e" />
                  <path d="M0 215 Q150 180 300 210 T470 195V260H0z" fill="#0a2336" />
                </svg>
                <Image className="van" src="/brand/van.png" alt="" width={300} height={137} priority />
              </div>
              <div className="seal">
                <svg viewBox="0 0 140 140">
                  <defs>
                    <path id="seal-c" d="M70 70m-52 0a52 52 0 1 1 104 0a52 52 0 1 1-104 0" />
                  </defs>
                  <circle cx="70" cy="70" r="68" fill="#0a2336cc" stroke="#ffffff44" />
                  <text fontFamily="Inter" fontSize="10.5" letterSpacing="3.4" fill="#9fd8f5">
                    <textPath href="#seal-c">COLLECTED · CLEANED · RETURNED ·</textPath>
                  </text>
                </svg>
                <div className="c">VK</div>
              </div>
              <div className="ticket">
                <small>Order no. 20481</small>
                <div className="t">
                  Delivered <em>by 6:40 pm</em>
                </div>
                <div className="d">
                  <span>14.2 lb</span>
                  <b>Wash &amp; Fold</b>
                </div>
              </div>
            </div>
          </div>
          <div className="wrap">
            <div className="strip">
              <div>
                <b>24–48 hr</b>Typical turnaround
              </div>
              <div>
                <b>21</b>Cities across Metro Atlanta
              </div>
              <div>
                <b>{moneyShort(book.freeDeliveryFrom)}</b>Free delivery from this basket
              </div>
              <div>
                <b>1 : 1</b>Dedicated support
              </div>
            </div>
          </div>
        </header>

        <section aria-labelledby="philosophy">
          <div className="wrap">
            <div className="sec rv" id="philosophy">
              <b>i.</b>Philosophy
            </div>
            <p className="stmt" data-words>
              <Words text="We believe the best service is the one you" /> <span><Words text="never have to think about." /></span> <Words text="You choose the hour. We handle the rest," />{" "}
              <em>
                <Words text="with the care you would give it yourself." />
              </em>
            </p>
          </div>
        </section>

        <section id="process" className="dstory" data-story aria-label="The process">
          <div className="spin">
            <div className="wrap">
              <div className="sec">
                <b>ii.</b>The process
              </div>
              <div className="g2">
                <div>
                  <div className="bign" data-count aria-hidden="true">
                    01
                  </div>
                  <ol className="list-reset">
                    {STEPS.map((s, i) => (
                      <li key={s.title} className={i === 0 ? "dst on" : "dst"} data-step>
                        <span className="i">{String(i + 1).padStart(2, "0")}</span>
                        <h3>{s.title}</h3>
                        <p>{s.text}</p>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="dshots" aria-hidden="true">
                  <div className="fr">
                    {STEPS.map((s, i) => (
                      <div key={s.img} className={i === 0 ? "dshot on" : "dshot"} data-shot>
                        <Image src={s.img} alt="" fill sizes="(max-width: 980px) 100vw, 540px" />
                      </div>
                    ))}
                  </div>
                  <div className="bar">
                    <i />
                  </div>
                  <div className="cap">
                    {STEPS.map((s, i) => (
                      <span key={s.cap} data-cap style={{ position: "absolute", whiteSpace: "nowrap", opacity: i === 0 ? 1 : 0, transition: ".5s" }}>
                        {s.cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" style={{ paddingTop: 40 }}>
          <div className="wrap">
            <div className="sec rv">
              <b>iii.</b>Services
            </div>
            <div className="svc rv">
              {[
                { i: "a.", h: "Standard Bag", p: `Wash, dry and fold, up to ${book.bagMaxLbs} lbs. Pickup and delivery ${moneyShort(book.deliveryFee)}.`, pr: moneyShort(book.bagPrice), s: "per bag", href: "/book" },
                { i: "b.", h: "Dry Cleaning", p: "Suits, dresses and delicates, pressed and returned on hangers.", pr: "Per item", s: "priced by garment", href: "/prices" },
                { i: "c.", h: "Express", p: "A 24-hour turnaround, where partner capacity allows.", pr: `+${moneyShort(book.expressFee)}`, s: "express 24 hours", href: "/book" },
                { i: "d.", h: "The Pass", p: `Up to ${book.pass.pickups} pickups a month with delivery included. Extra pickups ${moneyShort(book.pass.extraPickup)}.`, pr: moneyShort(book.pass.monthly), s: "per month", href: "/plans" },
              ].map((r) => (
                <Link key={r.h} href={r.href} className="sr">
                  <span className="i">{r.i}</span>
                  <h3>{r.h}</h3>
                  <p>{r.p}</p>
                  <div className="pr">
                    {r.pr}
                    <small>{r.s}</small>
                  </div>
                  <span className="ar" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="dreveal" aria-hidden="true">
          <div className="dbox" data-clip="10" data-r="0">
            <Image src="/img/studio-front.webp" alt="" fill sizes="100vw" />
            <div className="tx">
              <div className="kick">The ValetKleen standard</div>
              <h2>
                One standard.
                <br />
                <em>Every</em> order.
              </h2>
            </div>
          </div>
        </section>

        <section id="prices" className="plist">
          <div className="wrap">
            <div className="sec rv">
              <b>iv.</b>The price list
            </div>
            <PriceTabs tabs={tabs} />
            <p className="foot">
              A selection from {catalog.length} priced items. <Link href="/prices">See them all</Link> or <Link href="/book">book a pickup</Link>.
            </p>
          </div>
        </section>

        <section id="pass" style={{ background: "linear-gradient(180deg,var(--deep),#0c2b43 50%,var(--deep))" }}>
          <div className="wrap">
            <div className="sec rv">
              <b>v.</b>Membership
            </div>
            <div className="pass">
              <div className="rv" aria-hidden="true">
                <div className="passcard">
                  <Image className="l" src="/brand/logo-white.png" alt="" width={198} height={30} />
                  <Image className="vn" src="/brand/van.png" alt="" width={90} height={41} />
                  <div className="tier">The Pass</div>
                  <div className="no">VK · 0042 · 1187</div>
                </div>
              </div>
              <div className="rv">
                <h2>
                  Laundry, <em>without</em> the delivery fee.
                </h2>
                <ul>
                  <li>Up to {book.pass.pickups} pickups a month</li>
                  <li>Delivery included on every pickup</li>
                  <li>
                    {book.pass.minBags}-bag minimum, extra pickups {moneyShort(book.pass.extraPickup)}
                  </li>
                  <li>Pause or cancel whenever you wish</li>
                </ul>
                <div className="pp">
                  {moneyShort(book.pass.monthly)} <small>/ month</small>
                </div>
                <Link className="btn a" href="/plans">
                  Join the Pass &nbsp;→
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="dmos" aria-hidden="true">
          {[MOSAIC_A, MOSAIC_B].map((row, r) => (
            <div key={r} className="mrow" data-drift={r === 0 ? "-460" : "460"}>
              {row.map((n, i) => (
                <figure key={`${n}-${i}`}>
                  <Image src={`/img/${n}.webp`} alt="" width={450} height={300} style={{ width: "auto", height: "100%" }} />
                </figure>
              ))}
            </div>
          ))}
        </section>

        <div className="quote pho" style={{ ["--u" as string]: "url(/img/handoff-2.webp)" }}>
          <div className="wrap rv">
            <div className="mark" aria-hidden="true">
              “
            </div>
            <blockquote>
              <p>
                I stopped thinking about laundry the week I signed up. It simply <em>appears,</em> folded, exactly when they said.
              </p>
            </blockquote>
            <cite>Placeholder testimonial · Midtown, Atlanta</cite>
          </div>
        </div>

        <div className="cta">
          <div className="wrap rv">
            <div className="kick" style={{ justifyContent: "center" }}>
              Begin
            </div>
            <h2>
              Let us take <em>this</em>
              <br />
              off your hands.
            </h2>
            <div className="row">
              <Link className="btn s" href="/book">
                Book a pickup &nbsp;→
              </Link>
              <Link className="btn" href="/prices">
                See pricing
              </Link>
            </div>
          </div>
          <Image className="giant" src="/brand/logo-white.png" alt="" width={1000} height={152} />
        </div>
      </main>

      <footer>
        <Image src="/brand/logo-white.png" alt="ValetKleen" width={132} height={20} />
        <span className="sp" />
        <span>Metro Atlanta, GA</span>
        <Link href="/help">Help</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
